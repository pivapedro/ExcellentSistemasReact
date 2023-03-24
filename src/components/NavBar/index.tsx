import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const navigate = useNavigate();
  return (
    <Navbar bg="light" expand="xxl">
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/')}>Produtos</Nav.Link>
            <Nav.Link onClick={() => navigate('/orders')}>Pedidos</Nav.Link>
            <Nav.Link onClick={() => navigate('/orders/new')}>Novo Pedido</Nav.Link>
            <Nav.Link onClick={() => navigate('/product/new')}>Novo Produto</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
