import "../styles/globals.css";
import { SessionProvider, useSession, signIn } from "next-auth/react";
import * as React from "react";
import Navbar from "../components/navbar";
import Router from 'next/router'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import client from "../apollo-client";
import { ApolloProvider } from "@apollo/client";
import Head from 'next/head'
import Footer from '../components/footer'


import {ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "../lib/theme"

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  
  return (
    <>
      <Head>
        <title>PR0MUSIC</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <CssBaseline />
          <Navbar/>
          {Component.auth ? (
            <Auth options={Component.auth}>
              <Component {...pageProps} />
            </Auth>
          ) : (
            <Component {...pageProps} />
          )}
          <Footer />
          </ApolloProvider>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
}

function Auth({ children, options }) {
  const { data: session, status } = useSession()
  const isUser = !!session?.user
  let hasRole = false;
  if(typeof options.role == "string") {
    hasRole = session?.roles.includes(options.role)
  } else if (Array.isArray(options.role)) {
    hasRole = session?.roles.some(role => options.role.includes(role))
  }

  React.useEffect(() => {
    if (status === "loading") return
    if (!isUser) signIn()
    if (!hasRole) return Router.push('/')
  }, [isUser, status])

  if (isUser && hasRole) {
    return children
  }
  return(
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <CircularProgress color="secondary"/>
    </Box>
  )
}

export default MyApp;
