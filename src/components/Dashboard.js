import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	TableContainer,
	Text, Heading, Box,
	Checkbox,
	HStack,
	Spacer,
	Button,
	useToast
} from '@chakra-ui/react'
import axios from "axios"
import {
    Paginator,
    Container,
    Previous,
    usePaginator,
    Next,
    PageGroup
  } from "chakra-paginator";

import { SERVER } from "../App"

const PAGE_SIZE = 10

const Dashboard = () => {
	const [data, setData] = useState([])
	const [checkedList, setCheckedList] = useState([])

	const [dataTotal, setDataTotal] = useState(0)
	const [dataList, setDataList] = useState([])
	const [loaded, setLoaded] = useState(false)

	const [loading, setLoading] = useState(false)

	const toast = useToast()
    //Set old page
	const {
		isDisabled,
		pagesQuantity,
		currentPage,
		setCurrentPage,
		setIsDisabled,
		pageSize,
		setPageSize,
		offset
	} = usePaginator({
		total: dataTotal,
		initialState: {
			pageSize: PAGE_SIZE,
			currentPage: 1,
			isDisabled: false
		}
	});

	const fetchData = async () => {
		setLoaded(false)
		try {
			const res = await axios.get(SERVER + "/items")
			const result = res.data.Items.map(item => ({
				id: item.ITEM_ID,
				title: item.TITLE,
				genre: item.GENRE.split("|")[0]
			}))
			result.sort((a, b) => a.id - b.id)
			setData(result)
			setDataTotal(result.length)
			setLoaded(true)

			const totalPage = Math.ceil(result.length/PAGE_SIZE)
			if (currentPage > totalPage)
				handlePageChange(totalPage)
		} catch (e) {
			console.log("Load data Error", e.message)
		}
	}

	useEffect(() => {
		fetchData()
	}, [])

	useEffect(() => {
		if (!loaded)
			return

        if (data.length === 0) {
            setDataList([])
            return
        }

		if (offset >= data.length) {
			return
		}

		setDataList(data.slice(offset, Math.min(offset+pageSize, data.length)))
	}, [currentPage, offset, pageSize, data, loaded])


	const handlePageChange = (nextPage) => {
		setCurrentPage(nextPage);
	};

	const handlePageSizeChange = (event) => {
		const pageSize = Number(event.target.value);
		setPageSize(pageSize);
	};

	const handleDisableClick = () => {
		return setIsDisabled((oldState) => !oldState);
	};

	const handleCheck = (id) => {
		const isChecked = checkedList.includes(id)
		if (isChecked){
			setCheckedList(checkedList.filter(val => val !== id))
		}else{
			setCheckedList([...checkedList, id])
		}
	}

	const handleDelete = async () => {
		if (checkedList.length === 0) {
			toast({
				title: "Error",
				description: "Please choose at least 1 item to delete",
				status: "error",
				duration: 5000,
				isClosable: true,
			  })
		}

		try {
			setLoading(true)
			for (let i = 0; i < checkedList.length; i++) {
				await axios.delete(SERVER + "/items/" + checkedList[i])
			}
			fetchData()
			toast({
				title: "Delete Success",
				description: "Deleted items successfully!",
				status: "success",
				duration: 5000,
				isClosable: true,
			  })
			setLoading(false)
		} catch (e) {
			toast({
				title: "Error",
				description: "Cannot delete items",
				status: "error",
				duration: 5000,
				isClosable: true,
			  })
			setLoading(false)
		}
	}

	return (
		<Box w="90%" mr="auto" ml="auto" maxW="750px" mb="30px" mt="30px">
			<Heading textAlign="center" mb="20px">CRUD App</Heading>
			<HStack mb="20px">
				<Spacer />
				<Link to={"/create?id=" + (data.length > 0 ? data[data.length-1].id+1 : 1)}>
					<Button colorScheme="blue">Add</Button>
				</Link>
				<Button
					colorScheme="red"
					onClick={handleDelete}
					isLoading={loading}
					loadingText="Delete"
				>Delete</Button>
			</HStack>

			<TableContainer>
				<Table variant="simple">
					<Thead bg="#F7F7FC">
						<Tr>
							<Th></Th>
							<Th>ID</Th>
							<Th>Title</Th>
							<Th>Genre</Th>
							<Th></Th>
						</Tr>
					</Thead>
					<Tbody>
						{dataList.map(item => (
							<Tr key={item.id}>
                            <Td alignItems='center'>
						        <Checkbox isChecked={checkedList.includes(item.id)} onChange={() => handleCheck(item.id)} size='lg' colorScheme='green' />
                            </Td>

								<Td>{item.id}</Td>
								<Td wordBreak="break-word" whiteSpace="normal">{item.title}</Td>
								<Td>{item.genre}</Td>
								<Td>
									<Link to={"/update?id=" + item.id}>
										<Button>Edit</Button>
									</Link>
								</Td>
							</Tr>
						))}
					</Tbody>
				</Table>
			</TableContainer>
			<Paginator
				isDisabled={isDisabled}
				innerLimit={2}
				currentPage={currentPage}
				outerLimit={2}
				pagesQuantity={pagesQuantity}
				onPageChange={handlePageChange}
				activeStyles={{
					background: "blue.900",
					color: "white",
					p: '15px',
					mr: "5px",
					_hover: {
						bg: "facebook.100",
						color: "black"
					},
				}}
				normalStyles={{
					p:'15px',
					mr: "5px",
					_hover: {
						bg: "facebook.100",
					},
				}}
			>
				<Container align="center" justify="space-between" w="full" p={6} m='10px'>
					<Previous p='20px' bg= "white" textColor= 'blue.900' borderWidth='1px' borderColor='blue.900' _hover={{background: "blue.900", color:'white'}}>
						Previous
					</Previous>
					<PageGroup isInline align="center" />
					<Next p='20px' bg= "white" textColor= 'blue.900' borderWidth='1px' borderColor='blue.900' _hover={{background: "blue.900", color:'white'}}>
						Next
					</Next>
				</Container>
			</Paginator>
		</Box>
	);
}

export default Dashboard;

