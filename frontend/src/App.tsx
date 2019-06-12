import React from 'react'
import { BrowserRouter as Router, Route, Switch, RouteComponentProps, Redirect } from 'react-router-dom'
import qs from 'query-string'
import axios from 'axios'
import './App.css'
import spinner from './spinner.gif'

const linkOAuth = `https://slack.com/oauth/authorize?scope=identity.basic&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}`
const imgSlackSignIn = "https://api.slack.com/img/sign_in_with_slack.png"

const Home = () => (
	<div className="App">
		<header className="App-header">
			<a href={linkOAuth}>
				<img src={imgSlackSignIn} />
			</a>
		</header>
	</div>
)

const Success = (props: RouteComponentProps) => {
	console.log(props.location.state.res)
	return (
		<div className="App">
			<header className="App-header">
				<p>Check developer tools's console to see access token!</p>
			</header>
		</div>
	)
}

const Error = (props: RouteComponentProps) => {
	console.log(props.location.state.error)
	return (
		<div className="App">
			<header className="App-header">
				<p>Error while trying to get access token</p>
			</header>
		</div>
	)
}

enum AuthingState {
	LOADING,
	SUCCESS,
	ERROR
}

type State = {
	authingState: AuthingState,
	result: any
}

class Redirector extends React.Component<RouteComponentProps, State> {
	code = qs.parse(this.props.location.search).code
	
	constructor(props) {
		super(props)

		this.state = {
			authingState: AuthingState.LOADING,
			result: null
		}
		this.getAccessToken = this.getAccessToken.bind(this)
		this.getAccessToken()
	}

	async getAccessToken() {
		axios.get('http://localhost:4000/token', {
			params: {
				code: this.code
			}
		}).then( res => {
			this.setState({
				authingState: AuthingState.SUCCESS,
				result: res.data
			})
		}).catch( error => {
			this.setState({
				authingState: AuthingState.ERROR,
				result: error.toString()
            })
		})
	}

	render() {
		if(!this.code) return <Redirect to='/' />

		if (this.state.authingState == AuthingState.SUCCESS) {
			return <Redirect to={{ pathname: '/success', state: { res: this.state.result }}} />
		} else if (this.state.authingState == AuthingState.ERROR) {
			return <Redirect to={{ pathname: '/error', state: { error: this.state.result }}} />
		}

		return (
			<div className="App">
				<header className="App-header">
					<img src={spinner} />
				</header>
			</div>
		)
	}
}

class App extends React.Component<any, any> {
	render() {
		return (
			<Router>
				<Switch>
					<Route path='/redirect' component={Redirector} />
					<Route path='/success' component={Success} />
					<Route path='/error' component={Error} />
					<Route exact path='/' component={Home}/>
				</Switch>
			</Router>
		)
	}
}

export default App