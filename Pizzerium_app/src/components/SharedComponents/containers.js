import styled from "styled-components";

export const ListContainer = styled.div`
	width: 460px;
	max-height: 500px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

export const ListWrapper = styled.div`
	width: 100%;
	height: 500px;
	padding: 0 2rem;
	border-radius: 10px;
	overflow-y: auto;
	overflow-x: hidden;
`;
