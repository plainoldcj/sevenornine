import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import ApolloClient from 'apollo-boost';
import { gql } from 'apollo-boost';
import { ApolloProvider, useQuery } from '@apollo/react-hooks';

const client = new ApolloClient({
	uri: 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql'
});

// HSL:1203422
// HSL:1203406

function formatTime(realtimeDeparture, serviceDay)
{
	// var date = new Date((realtimeDeparture + serviceDay)*1000);

	// // Hours part from the timestamp
	// var hours = date.getHours();
	// // Minutes part from the timestamp
	// var minutes = "0" + date.getMinutes();
	// // Seconds part from the timestamp
	// var seconds = "0" + date.getSeconds();

	// // Will display time in 10:30:23 format
	// var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

	// var ms = date - new Date();

	var ms = (realtimeDeparture + serviceDay)*1000 - Date.now();

	return Math.floor(ms / (1000 * 60));
}

function Hsl(props)
{
	var stopname = props.value;

	var HSL_QUERY = gql`
	{
		stop(id: "${stopname}") {
			name
				stoptimesWithoutPatterns {
					scheduledArrival
						realtimeArrival
						arrivalDelay
						scheduledDeparture
						realtimeDeparture
						departureDelay
						realtime
						realtimeState
						serviceDay
						headsign
				}
		}
	}
	`;

	const { loading, error, data } = useQuery(HSL_QUERY);

	if(loading) return <p>Loading...</p>;
	if(error) return <p>Error</p>;

	return data.stop.stoptimesWithoutPatterns.map(({ realtimeDeparture, serviceDay, headsign }) => (
		<div>
			<p>
				{headsign}: {formatTime(realtimeDeparture, serviceDay)}min
			</p>
		</div>
	));
}

const App = () => (
	<ApolloProvider client={client}>
		<p>
			<Hsl value="HSL:1203422" />
		</p>
		----------------
		<p>
			<Hsl value="HSL:1203406" />
		</p>
	</ApolloProvider>
);

ReactDOM.render(
	<App />,
	document.getElementById('root')
);

