import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';

import Highlighter from 'react-highlight-words';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';

type DataIndex = keyof Course;

interface Course {
    key: string;
    subject: string;
    yearLevel: number;
}

const CourseYearTable: React.FC = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);

	const [currentCourse, setCurrentCourse] = useState('');
	const [currentYear, setCurrentYear] = useState(0);

	const [theData, setTheData] = useState<Course[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
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
										"sections_id": `${currentYear}*`
									}
								},
								{
									"IS": {
										"sections_dept": currentCourse.toLowerCase()
									}
								}
							]
						},
						"OPTIONS": {
							"COLUMNS": [
								"sections_dept",
								"sections_id"
							]
						},
						"TRANSFORMATIONS": {
							"GROUP": [
								"sections_dept",
								"sections_id"
							],
							"APPLY": []
						}
					}),
				});

				const result = await response.json();
				const filteredCourses: Course[] = result.result.map((aCourse: { sections_dept: any; sections_id: string; }) => {
					const courseName = aCourse.sections_dept.toUpperCase() + aCourse.sections_id;
					return {
						key: courseName,
						subject: aCourse.sections_dept,
						yearLevel: Number(aCourse.sections_id),
					};
				});
				setTheData(filteredCourses);
			} catch (error) {
				console.error("Error:", error);
			}
		};

		fetchData().then(() => {
			console.log("Fetch Data completed");
		});
	}, [currentCourse, currentYear]);


    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);

		if (dataIndex === 'subject') {
			setCurrentCourse(selectedKeys[0]);
		} else if (dataIndex === 'yearLevel') {
			setCurrentYear(parseInt(selectedKeys[0]));
		}
    };

    const handleReset = (clearFilters: () => void, dataIndex: DataIndex) => {
        clearFilters();
		if (dataIndex === 'subject') {
			setCurrentCourse('');
		} else if (dataIndex === 'yearLevel') {
			setCurrentYear(0);
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
            title: 'Subject (ex. cpsc)',
            dataIndex: 'subject',
            key: 'subject',
            width: '33%',
            ...getColumnSearchProps('subject'),
        },
        {
            title: 'Year Level',
            dataIndex: 'yearLevel',
            key: 'yearLevel',
            width: '33%',
			...getColumnSearchProps('yearLevel'),
        },
		{
			title: 'Course Name',
			dataIndex: 'key',
			key: 'key',
			width: '33%',
		},
    ];
    return <Table dataSource={theData} columns={columns} />;
};

export default CourseYearTable;
