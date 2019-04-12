import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import styled from "styled-components";
import axios from 'axios';

const GREEN = "#00796b";
const API_ENDPOINT = "https://coordinated-face.glitch.me/api/quote/all";

const Page = styled.div`
  min-height: 100vh;
  width: 100%;
  background-color: ${GREEN};
`

const Wrapper = styled.div`
  margin: 0 auto;
  min-height: 100vh;
  min-width: 100%;
  color: #fff;
  display: grid;
  grid-template-rows: 100px 1fr 150px;
  grid-template-columns: 1fr;
  grid-template-areas:
  "header"
  "quote"
  "controls";
`
const Header = styled.header`
  width: 100%;
  height: 100px;
  font-family: 'Times New Roman', Times, serif;
  color: #fff;
  text-align: center;
  font-size: 3rem;
  font-weight: bold;
  text-shadow: 1px 1px 5px rgba(0,0,0,.5);
  padding-top:1rem;
  grid-area: header;
`

const QuoteBox = styled.div`
  margin: 2rem auto;
  max-width: 900px;
  display: ${props => props.isLoading ? "none" : "flex"};
  flex-direction: column;
  justify-content: center;
  align-content: center;
  grid-area: quote;
`
const Title = styled.h1`
  padding: 0 1.5rem;
  font-family: 'Times New Roman', Times, serif;
  text-shadow: 2px 2px 3px rgba(0,0,0,.3);
  align-self: center;
  ::first-letter{
    color: lightcoral;
    font-size: 3.5rem;
  }
`
const Author = styled.p`
  margin: .7rem .5rem 0 0;
  text-align: right;
  font-size: 2.8rem;
  font-weight: 500;
  font-family: "Alex Brush", cursive;
  line-height: .8;
  color: lightcoral;
`
const Controls = styled.div`
  color: #fff;
  width: 450px;
  margin: 0 auto;
  display: ${props => props.isLoading ? "none" : "flex"};
  justify-content: space-around;
  grid-area: controls;
  a{
    font-size: 2rem;
  }
`

const Button = styled.input`
  height: 40px;
  border: 1px #fff solid;
  padding: .5rem 4rem;
  background-color: transparent;
  color: inherit;
  font-family: monospace;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  :focus{
    outline: none;
  }
  :hover{
    background-color: #fff;
    color: ${GREEN};
    transition: color .2s, background-color .2s;
  }
`
const Footer = styled.footer`
  background-color: #33333399;
  height: 50px;
  position: sticky;
  bottom: 0;
  padding: 15px;
  p{
    text-align: right;
    margin-right: .5rem;
    color: #ccc;
    font-style: italic;
  }
`
function App() {
    /// Définitions
    const [isLoading, setIsLoading] = useState(true);
    const [cantFetchData, setCantFetchData] = useState(false);
    const [quote, setQuote] = useState({});
    const [intervalID, setIntervalID] = useState(null);
    const [intervalDelay, setIntervalDelay] = useState(60000); // 1 minute

    /// ComponentDidMount
    useEffect(()=> {
      fetchQuote();
      handleInterval(intervalDelay);
    }, []);

    /// Handle Interval ID
    function handleInterval(delay = 0){
      if(intervalID === null){
        const id = setInterval(() => {
          fetchQuote()
        }, delay);
        setIntervalID(id);
      }
      else {
        clearInterval(intervalID);
        setIntervalID(null);
      }
    }
    /// Async Request
    async function fetchQuote(){
      setIsLoading(true);
      try {
        const result = await axios.get(API_ENDPOINT);         
        setQuote(result.data);
        setCantFetchData(false);
        setIsLoading(false);
      }
      catch(e){
        console.log(e)
        setIsLoading(false);
        setCantFetchData(true);
      }
    }

    /// View
    return (
      <Page>

        <Wrapper id="quote-box">
          <Header>The Quote Box</Header>          
        {
          cantFetchData && <Title>Unable to fetch data from server, sorry !</Title>
        }
        {
          isLoading && <Title>Loading...</Title>
        }
          <QuoteBox isLoading={isLoading} >
            <Title id="text">{quote.quote}</Title>
            <Author id="author">{quote.author}</Author>
          </QuoteBox>
          <Controls isLoading={isLoading}>
            <a href={`https://twitter.com/intent/tweet?text=${quote.quote}${quote.author}`} target="_blank" id="tweet-quote"><i className="fab fa-twitter"></i></a>
            <Button type="submit" value="New" id="new-quote" onClick={fetchQuote}/>
            
          </Controls>
        </Wrapper>
        <Footer>
            <p>By <a href="https://github.com/Logik-Dev" target="_blank">LogikDev</a></p>
          </Footer>
      </Page>
    );
}

ReactDOM.render(<App />,
  document.getElementById('root'));