import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import SparqlGenerator from '../../lib/SparqlGenerator';
import Query from '../../lib/Query';

class WdqsButton extends Component {

	goToWdqs() {
		const baseUrl = 'https://query.wikidata.org';

		window.open(`${baseUrl}/#${encodeURIComponent(SparqlGenerator.generate(this.props.query))}`);
	}

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<Button
				className={this.props.className}
				variant="contained"
				color="primary"
				onClick={() => this.goToWdqs()}
			>{this.props.children}</Button>
		);
	}
}

export default WdqsButton;

WdqsButton.propTypes = {
	className: PropTypes.string,
	query: PropTypes.instanceOf(Query),
};
