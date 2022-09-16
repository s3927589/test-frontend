import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Dashboard from "./components/Dashboard"
import CreateItem from "./components/CreateItem"
import UpdateItem from "./components/UpdateItem"

export const SERVER = "https://lov63ndc3m.execute-api.ap-southeast-1.amazonaws.com"

const App = () => {
	return (
		<ChakraProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Dashboard />}/>
					<Route path="/create" element={<CreateItem />}/>
					<Route path="/update" element={<UpdateItem />}/>
				</Routes>
			</BrowserRouter>

		</ChakraProvider>
	);
}

export default App;
