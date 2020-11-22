import WdqsButton from '../WdqsButton';
import styled from 'styled-components';

export const StyledForm = styled.form`
	display: flex;
	flex-direction: column;
	margin: 7px 15px 15px 15px;
	width: 280px;
`;

export const StyledCol2 = styled.div`
	display: grid;
	grid-gap: 4%;
	grid-template-columns: 48% 48%;
`;

export const StyledWdqsButton = styled(WdqsButton)`
	&& {
		margin-top: 30px;
	}
`;