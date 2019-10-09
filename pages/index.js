import React, { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import axios from 'axios'
import { Flex, Box } from 'reflexbox'
import { SessionContext } from '../components/context/sessionContext'

const LOGIN_API = '/api/login'

const Home = () => {
  const router = useRouter()
  const [auth, setAuth] = useState({
    username: '',
    password: ''
  })
  const [session, setSession] = useState(null)
  const [sessionError, setSessionError] = useState(null)
  const [loading, setLoading] = useState(null)

  const handleSetAuth = event => {
    const { name, value } = event.target

    setAuth({ ...auth, [name]: value })
  }

  const handleLogin = async e => {
    const { username, password } = auth

    e.preventDefault()

    if (username && password) {
      setSessionError(null)
      setLoading(true)

      console.log('Logging in...')

      try {
        const request = await axios.get(LOGIN_API, {
          params: {
            username,
            password
          }
        })

        if (request.status === 200) {
          if (!request.data.error && request.data.session) {
            console.log(`Logged in... Session ${request.data.session}`)
            localStorage.setItem('session', request.data.session)
            setSession(request.data.session)
            router.push('/accounts')
          }
        }
      } catch (error) {
        setSessionError(error.message)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <SessionContext.Provider
      value={{
        session: session,
        sessionError: sessionError
      }}>
      <div className="hero-container">
        <Head>
          <title>Login</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Flex
          className="hero"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            height: '100vh'
          }}>
          <Box width={[1, 1 / 3]}>
            <Box as="form" onSubmit={handleLogin} className="container has-text-centered">
              <Box px={4} className="login-container">
                <Box width={1} className="field">
                  <div className="control">
                    <input
                      type="text"
                      placeholder="MyFxbook username"
                      autoComplete="username"
                      autoCapitalize="none"
                      autoCorrect="off"
                      className="input"
                      value={auth.username}
                      name="username"
                      onChange={handleSetAuth}
                    />
                  </div>
                </Box>
                <Box width={1} className="field">
                  <div className="control">
                    <input
                      type="password"
                      placeholder="MyFxbook password"
                      autoComplete="password"
                      className="input"
                      value={auth.password}
                      name="password"
                      onChange={handleSetAuth}
                    />
                  </div>
                </Box>
                <Box width={1} className="field">
                  <div className="control">
                    <button className="button is-link is-fullwidth" onClick={handleLogin}>
                      {loading ? 'Loading...' : 'Login'}
                    </button>
                  </div>
                </Box>
              </Box>
            </Box>
          </Box>
        </Flex>

        <style jsx>{`
          .hero-container {
            background-color: #262b34;
            height: 100vh;
          }
          .login-container {
            max-width: 50rem;
            margin: 0 auto;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    </SessionContext.Provider>
  )
}

export default Home
