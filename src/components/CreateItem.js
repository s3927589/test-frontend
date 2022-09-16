import React, { useEffect, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
	Heading, Box,
	HStack,
	Button,
	FormControl,
	FormLabel,
	FormErrorMessage,
	Input, useToast
} from '@chakra-ui/react'
import axios from "axios"

import { SERVER } from "../App"

const CreateItem = () => {
	const [title, setTitle] = useState("")
	const [titleError, setTitleError] = useState(false)
	const [searchParams, setSearchParams] = useSearchParams()
	const navigate = useNavigate()
	const toast = useToast()

	const [genre, setGenre] = useState("")
	const [genreError, setGenreError] = useState(false)

	const [loading, setLoading] = useState(false)

	useEffect(() => {
		const id = searchParams.get("id")
		if (!id) {
			navigate("/")
		}

		try {
			let intId = parseInt(id)
		} catch(e) {
			navigate("/")
		}
	})

	const handleSubmit = async () => {
		if (title === "") {
			setTitleError(true)
			return
		}
		setTitleError(false)

		if (genre === "") {
			setGenreError(true)
			return
		}
		setGenreError(false)

		setLoading(true)
		const id = searchParams.get("id")
		try {
			await axios.put(SERVER + "/items", {
				id,
				title,
				genre
			})
			toast({
				title: "Added Success",
				description: "Added item successfully!",
				status: "success",
				duration: 5000,
				isClosable: true,
			})
			setSearchParams({id: parseInt(id) + 1})
			setLoading(false)
		} catch (e) {
			console.log("Create Error", e.message)
			setLoading(false)
		}
	}

	return (
		<Box w="90%" mr="auto" ml="auto" maxW="700px" mb="30px" mt="30px">
			<Heading textAlign="center" mb="20px">Create New Item</Heading>

			<Box>
				<FormControl isInvalid={titleError} mb="20px">
					<FormLabel>Movie Title</FormLabel>
					<Input type="text" value={title} onChange={e => setTitle(e.target.value)} />
					{titleError ? (
						<FormErrorMessage>Movie title is required.</FormErrorMessage>
					) : <Box></Box>}
				</FormControl>

				<FormControl isInvalid={genreError} mb="20px">
					<FormLabel>Genre</FormLabel>
					<Input type="text" value={genre} onChange={e => setGenre(e.target.value)} />
					{genreError ? (
						<FormErrorMessage>Genre is required.</FormErrorMessage>
					) : <Box></Box>}
				</FormControl>

				<HStack>
					<Button
						onClick={handleSubmit}
						colorScheme="green"
						isLoading={loading}
						loadingText="Submit"
					>Submit</Button>
					<Link to="/">
						<Button>Go Back</Button>
					</Link>
				</HStack>
			</Box>
		</Box>
	);
}

export default CreateItem;
