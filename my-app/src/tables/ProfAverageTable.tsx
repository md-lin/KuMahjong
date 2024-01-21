import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';

import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

type DataIndex = keyof Course;

// START HERE
// work on the fetching for ProfAverage user storu
// we'll need 2 fetches:
//1. for getting the overall of a specific course (ex cpsc313)
//2. for getting the overall of a specific course taugh by a specific instructor (ex. cpsc313, rachel)

// u can do it yuhh

interface Course {
	key: string;
	course: string;
	prof: string;
	profAv: number;
	overallAv: number;
}


const ProfAverageTable: React.FC = () => {
	const [searchText, setSearchText] = useState('');
	const [searchedColumn, setSearchedColumn] = useState('');
	const searchInput = useRef<InputRef>(null);

	const [currentCourse, setCurrentCourse] = useState('');
	const [currentProf, setCurrentProf] = useState('');

	const [theData, setTheData] = useState<Course[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [subject, number] = currentCourse.split(/(\D+)(\d+)/).filter(Boolean);
				const response = await fetch("http://localhost:4321/query", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"WHERE": {
							"AND": [
								{
									"IS": {
										"sections_instructor": `*${currentProf}*`
									}
								},
								{
									"IS": {
										"sections_dept": subject
									}
								},
								{
									"IS": {
										"sections_id": number
									}
								}
							]
						},
						"OPTIONS": {
							"COLUMNS": [
								"sections_dept",
								"sections_id",
								"overallAvg",
								"sections_title",
								"sections_instructor"
							]
						},
						"TRANSFORMATIONS": {
							"GROUP": [
								"sections_dept",
								"sections_id",
								"sections_title",
								"sections_instructor"
							],
							"APPLY": [
								{
									"overallAvg": {
										"AVG": "sections_avg"
									}
								}
							]
						}
					}),
				});

				const response2 = await fetch("http://localhost:4321/query", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						"WHERE": {
							"AND": [
								{
									"IS": {
										"sections_dept": subject
									}
								},
								{
									"IS": {
										"sections_id": number
									}
								}
							]
						},
						"OPTIONS": {
							"COLUMNS": [
								"sections_dept",
								"sections_id",
								"overallAvg",
								"sections_title"
							]
						},
						"TRANSFORMATIONS": {
							"GROUP": [
								"sections_dept",
								"sections_id",
								"sections_title"
							],
							"APPLY": [
								{
									"overallAvg": {
										"AVG": "sections_avg"
									}
								}
							]
						}
					}),
				});

				const result = await response.json();
				const result2 = await response2.json();
				const overallData: any[] = result2.result;
				const overallAverage = overallData[0].overallAvg;


				const filteredCourses: Course[] = result.result
					.filter((aCourse: { sections_dept: any; sections_id: string; sections_instructor: string; overallAvg: number }) => {
						return aCourse.sections_instructor && aCourse.sections_instructor.trim() !== ''; // check if professor is present
					})
					.map((aCourse: { sections_dept: any; sections_id: string;
				sections_instructor: string; overallAvg: number;}) => {
					const courseName = aCourse.sections_dept.toUpperCase() + aCourse.sections_id;
					return {
						//key: courseName,
						course: courseName,
						prof: aCourse.sections_instructor,
						profAv: aCourse.overallAvg,
						overallAv: overallAverage,
					};
				});
				setTheData(filteredCourses);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchData().then(() => {
			console.log("Fetch Prof average completed");
		});
	}, [currentCourse, currentProf]);


	const handleSearch = (
		selectedKeys: string[],
		confirm: (param?: FilterConfirmProps) => void,
		dataIndex: DataIndex,
	) => {
		confirm();
		setSearchText(selectedKeys[0]);
		setSearchedColumn(dataIndex);

		if (dataIndex === 'course') {
			setCurrentCourse(selectedKeys[0]);
		} else if (dataIndex === 'prof') {
			setCurrentProf(selectedKeys[0]);
		}
	};

	const handleReset = (clearFilters: () => void, dataIndex: DataIndex) => {
		clearFilters();
		if (dataIndex === 'course') {
			setCurrentCourse('');
		} else if (dataIndex === 'prof') {
			setCurrentProf('');
		}
		setSearchText('');
	};

	const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<Course> => ({
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
			<div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
				<Input
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					onPressEnter={() => {
						handleSearch(selectedKeys as string[], confirm, dataIndex);
					}}
					style={{ marginBottom: 8, display: 'block' }}
				/>
				<Space>
					<Button
						type="primary"
						onClick={() => {
							handleSearch(selectedKeys as string[], confirm, dataIndex);
						}}
						icon={<SearchOutlined />}
						size="small"
						style={{ width: 90 }}
					>
						Search
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters, dataIndex)}
						size="small"
						style={{ width: 90 }}
					>
						Reset
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							confirm({ closeDropdown: false });
							setSearchText((selectedKeys as string[])[0]);
							setSearchedColumn(dataIndex);
						}}
					>
						Filter
					</Button>
					<Button
						type="link"
						size="small"
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: (filtered: boolean) => (
			<SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes((value as string).toLowerCase()),
		onFilterDropdownOpenChange: (visible) => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		},
		render: (text) =>
			searchedColumn === dataIndex ? (
				<Highlighter
					highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
					searchWords={[searchText]}
					autoEscape
					textToHighlight={text ? text.toString() : ''}
				/>
			) : (
				text
			),
	});

	const columns = [
		{
			title: 'Course (ex. CPSC313)',
			dataIndex: 'course',
			key: 'course',
			width: '25%',
			...getColumnSearchProps('course'),
		},
		{
			title: 'Professor (ex. Norm Hutchinson)',
			dataIndex: 'prof',
			key: 'prof',
			width: '25%',
			...getColumnSearchProps('prof'),
		},
		{
			title: 'Professor Average',
			dataIndex: 'profAv',
			key: 'profAv',
			width: '25%',
		},
		{
			title: 'Overall Average',
			dataIndex: 'overallAv',
			key: 'overallAv',
			width: '25%',
		},
	];
	return <Table dataSource={theData} columns={columns} />;
};

export default ProfAverageTable;
