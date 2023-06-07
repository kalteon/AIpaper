import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Row, Col, Table, ButtonGroup, Card, Placeholder, Alert } from 'react-bootstrap';

function TitlePage({}) {
  const navigate = useNavigate();
  const location = useLocation();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const goToHome = () => {
    navigate("/");
  }

  useEffect(() => {
    const data = location.state.data;
    setArticles(data.articles);
  }, []);

  const handleHeadlineClick = async (article) => {
    setIsLoading(true);
    const response = await fetch(`http://localhost:5010/api/summary`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(article),
    });
    const result = await response.json();
    setIsLoading(false);
    navigate("/Summary", {state : {a : result}})
  };

  return(
    <div>
      
      <Row>
          <Col md={{ span: 6, offset: 3 }}>
          <Button type = "submit" onClick={goToHome} variant="light">Home</Button>
            {isLoading ? (
            <div>
              <Alert variant="info" >
                내용을 불러오는 데 약 30초 정도 걸립니다. 잠시만 기다려 주세요.
              </Alert>
              <Card border="dark">
                <Card.Body>
                  <Placeholder as={Card.Header} animation="wave">
                    <Placeholder style={{ width: '100%', height: '50px' }}/>
                  </Placeholder>
                  <Placeholder as={Card.Text} animation="wave">
                    <Placeholder style={{ width: '100%', height: '500px' }}/>
                  </Placeholder>
                  <ButtonGroup className="d-flex">
                    <Placeholder.Button variant="info"/>
                    <Placeholder.Button variant="dark"/>
                    <Placeholder.Button variant="danger"/>
                  </ButtonGroup>
                </Card.Body>
              </Card>
            </div>
            ) : (
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
            )}
          
          </Col>
        </Row>
    </div>
  );
}

export default TitlePage;