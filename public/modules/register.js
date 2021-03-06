import { emptyFields } from '../assets/js/functions.js'
import http from '../assets/js/httpstatus.js'

/*
 * called after html contents are loaded into the main of index.html
 * sets up onclick listeners
 */
export function setup() {
	// wait for form submission, then run login()
	document.querySelector('form').addEventListener('submit', async event => await register(event))
	// detect changes in password and passwordconf box
	document.getElementById('password').addEventListener('input', async event => await passConfCheck(event))
	document.getElementById('passwordconf').addEventListener('input', async event => await passConfCheck(event))
}

/*
 * gets register form data
 * @param {Object} event containing form submission data
 */
async function register(event) {
	event.preventDefault() // stops standard html form submission
	document.getElementById('error').style.display = 'none' // hide error message box
	try {
		const registerform = document.getElementById('register')
		const data = Object.fromEntries(new FormData(registerform).entries())

		if( emptyFields(data) ) throw 'Not all fields are filled'
		if( data.password !== data.passwordconf) throw 'Passwords do not match'

		await postRegister(data)

	} catch (error) {
		const errorBox = document.getElementById('error') // display error
		errorBox.style.display = 'block'
		errorBox.firstChild.innerHTML = error // change text of inner div
	}
}

/*
 * posts register form data to server, alerts user on success and redirects
 * @param {Object} contains form data
 */
async function postRegister(data) {
	// post register data
	const options = { method: 'post', body: JSON.stringify(data) }
	const response = await fetch('/register', options)
	const json = await response.json()

	if( response.status === http.Unprocessable ) {
		// error in creating the account
		throw json.msg // throw error message
	} else if (response.status === http.Created ) {
		// user registered successfully
		window.alert(json.msg) //alert user account was created
		window.location.href = '/#login' // redirect to login

	} else {
		throw `${response.status}: ${json.msg}`
	}
}

/*
 * checks password and password confirmation boxes to alert user if they dont match
 */
async function passConfCheck() {
	const passBox = document.getElementById('password')
	const passConfBox = document.getElementById('passwordconf')

	if( passBox.value === passConfBox.value && passBox.value.length > 0) {
		// passwords are the same
		passBox.style.borderBottom = '2px solid #30FFb7'
		passConfBox.style.borderBottom = '2px solid #30FFb7'
	} else if ( passConfBox.value.length === 0 ) {
		// passconf box empty
		passBox.style.borderBottom = '2px solid #4ea3e6'
		passConfBox.style.borderBottom = '2px solid #4ea3e6'
	} else {
		// passwords dont match
		passBox.style.borderBottom = '2px solid #4ea3e6'
		passConfBox.style.borderBottom = '2px solid red'
	}
}
