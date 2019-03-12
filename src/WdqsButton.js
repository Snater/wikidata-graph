import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SparqlGenerator from './SparqlGenerator';

class WdqsButton extends Component {

	goToWdqs() {
		const baseUrl = 'https://query.wikidata.org';

		window.open(`${baseUrl}/#${encodeURIComponent(
			SparqlGenerator.generate(this.props.queryProps)
		)}`);
	}

	render() {
		return (
			<Button
				variant="contained"
				color="primary"
				onClick={() => this.goToWdqs()}
			>{this.props.children}</Button>
		);
	}
}

export default WdqsButton;

WdqsButton.propTypes = {
	queryProps: PropTypes.object,
};
