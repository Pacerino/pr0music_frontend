import { ApolloClient, InMemoryCache , createHttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { getSession } from "next-auth/react"

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_API_URL,
    credentials: 'include'
});

const authLink = setContext(async (_, { headers }) => {
	const session = await getSession()
	const modifiedHeader = {
		headers: {
			...headers,
		},
	};
    if (session?.accessToken) {
        modifiedHeader.headers.Authorization = `Bearer ${session.accessToken}`
    }

	return modifiedHeader;
});

const client = new ApolloClient({
	link: from([authLink, httpLink]),
    cache: new InMemoryCache(),
});

export default client;
