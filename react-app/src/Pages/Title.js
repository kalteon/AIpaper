import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button, Row, Col, Nav, Container, Spinner, Table } from 'react-bootstrap';

function TitlePage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSpinner, setIsSpinner] = useState(false);
  const [articles, setArticles] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const goToHome = () => {
    navigate("/");
  }

  useEffect(() => {
    const data = location.state.data;
    setArticles(data.articles);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(inputValue);
    const response = await fetch(`http://localhost:5010/api/article?keyword=${inputValue}`);
    const data = await response.json();
    
    setIsSpinner(false);
    //setArticles(data.articles);
    console.log(data.articles);
    // title.js에서 바로 검색결과를 보여줄 수 있으므로 setArticles를 사용
    setArticles(data.articles);
    setInputValue('');
  };
  
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleHeadlineClick = async (article) => {
    const response = await fetch(`http://localhost:5010/api/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    
    const result = await response.json();
    console.log(result);
    //setSummary(result.summary);
    //console.log(summary);
    navigate("/summary", {state : {a : result}})
  };

  return(
    <div>
      <Row>
          <Col md={{ span: 6, offset: 3 }}>
          <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
          <form onSubmit={handleSubmit}  style = {{ display : 'flex', alignItems: 'center'}}>          
            <input type="text" style={{ width: '400px', height: '50px', fontSize: '20px',marginRight: '15px',marginBottom: '5px'}} onChange={handleInputChange} value = {inputValue}/>
            {isSpinner?
              <Spinner variant="primary" animation="border" style={{  width: '35px', height: '35px'}} /> :
              <Button type="submit" style={{ width: '150px', height: '50px', fontSize: '20px', marginBottom: '5px' }}>Search</Button>}
          </form> 
          <Table striped border hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Headline</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td onClick={() => handleHeadlineClick(article)}>{article.headline}</td>
              </tr>
            ))}
          </tbody>
          </Table>
          </Col>
        </Row>
    </div>
  );
}

export default TitlePage;