import PropTypes from 'prop-types';
import React, { Component } from 'react';
import EntitySelect from './EntitySelect';
import LanguageSelect from './LanguageSelect';
import ModeSelect from './ModeSelect';
import NumberInput from './NumberInput';
import WdqsButton from './WdqsButton';
import styles from './Form.module.css';

class Form extends Component {

	/**
	 * @inheritdoc
	 */
	render() {
		return (
			<form className={styles.Form}>
				<EntitySelect
					entityType="item"
					entityId={this.props.queryProps.item}
					onChange={value => this.props.onChange({item: value})}
					label="Root Item"
				/>
				<EntitySelect
					entityType="property"
					entityId={this.props.queryProps.property}
					onChange={value => this.props.onChange({property: value})}
					label="Traversal Property"
				/>
				<div className={styles.col2}>
					<ModeSelect
						id="mode"
						value={this.props.queryProps.mode}
						onChange={value => this.props.onChange({mode: value})}
					/>
					<LanguageSelect
						id="language"
						value={this.props.queryProps.language}
						onChange={value => this.props.onChange({language: value})}
					/>
				</div>
				<div className={styles.col2}>
					<NumberInput
						label="Iterations"
						value={parseInt(this.props.queryProps.iterations)}
						onChange={value => this.props.onChange({iterations: value})}
					/>
					<NumberInput
						label="Limit"
						value={parseInt(this.props.queryProps.limit)}
						onChange={value => this.props.onChange({limit: value})}
					/>
				</div>
				<EntitySelect
					entityType="property"
					entityId={this.props.queryProps.sizeProperty}
					onChange={value => this.props.onChange({sizeProperty: value})}
					label="Circle Size Property"
				/>
				<WdqsButton
					className={styles.button}
					queryProps={this.props.queryProps}
				>Run on Wikidata Query Service</WdqsButton>
			</form>
		);
	}
}

Form.propTypes = {
	queryProps: PropTypes.shape({
		item: PropTypes.string,
		property: PropTypes.string,
		mode: PropTypes.string,
		language: PropTypes.string,
		iterations: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		sizeProperty: PropTypes.string,
	}),
	onChange: PropTypes.func,
};

export default Form;
