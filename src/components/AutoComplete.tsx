import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props<T> {
	api: (keyWord: string) => T[];
	template: (
		item: T,
		isSelected: boolean,
		callback: () => void
	) => JSX.Element;
}

function AutoComplete<T>({ api, template }: Props<T>) {
	const [inputData, setInputData] = useState('');
	const [matchedList, setMatchedList] = useState<T[]>([]);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [isOpen, setIsOpen] = useState(false);

	const onChange = ({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
		setInputData(value);
		setSelectedIndex(0);
	};

	const checkKey = ({ key }: KeyboardEvent<HTMLInputElement>) => {
		if (key === 'ArrowUp') {
			setSelectedIndex(
				(prev) => (prev - 1 + matchedList.length) % matchedList.length
			);
		} else if (key === 'ArrowDown') {
			setSelectedIndex((prev) => (prev + 1) % matchedList.length);
		} else if (key === 'Enter') {
			// 기준 속성을 인자로 받도록 & 타입지정
			setInputData(matchedList[selectedIndex].name);
		}
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			setMatchedList(api(inputData).slice(0, 5));
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, [inputData]);

	const selectItem = (name: string) => {
		setInputData(name);
	};

	return (
		<Container>
			<Input
				type='text'
				value={inputData}
				onFocus={() => setIsOpen(true)}
				onChange={onChange}
				onKeyDown={checkKey}
				onBlur={() => {
					setTimeout(() => {
						setSelectedIndex(0);
						setIsOpen(false);
					}, 1000);
				}}
			/>
			{isOpen && (
				<MatchedList>
					{matchedList &&
						matchedList.map((matchedItem, index) => (
							<React.Fragment key={index}>
								{template(matchedItem, index === selectedIndex, () => {
									// 기준 속성을 인자로 받도록 & 타입지정
									selectItem(matchedItem.name)
								})}
							</React.Fragment>
						))}
				</MatchedList>
			)}
		</Container>
	);
}

export default AutoComplete;

const Container = styled.div`
	width: 500px;
	height: 300px;
	margin: 50px auto;
	* {
		box-sizing: border-box;
		list-style: none;
	}
`;

const Input = styled.input`
	width: 500px;
	height: 50px;
	border-radius: 10px;
	padding: 10px;
`;

const MatchedList = styled.ul`
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 5px;
	}
	&::-webkit-scrollbar-thumb {
		background-color: #000;
		border-radius: 10px;
	}
`