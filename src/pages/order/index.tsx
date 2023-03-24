import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { apis } from "../../services";
import { DeviceContext } from "../../store";
interface IOrders {
  order_id: number;
  client: string;
}
const OrderPage = () => {
  const navigate = useNavigate();
  const { setID, id } = useContext(DeviceContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [orders, setOrders] = useState<IOrders[]>([]);

  const getOrders = async () => {
    const { data } = await apis.getOrders();
    setOrders(data);
  };
  const gotoNewOrder = () => {
    setID?.(0);
    navigate("new");
  };
  const selectOrder = async (id: number) => {
    setID?.(id);
    handleShow();
  };

  const deleteOrder = async () => {
    try {
      const { data } = await apis.deleteOrder({ order_id: id });
      console.log(data);
      setID?.(0);
      getOrders();
      handleClose();
    } catch (error) {
      handleClose();
      console.log(error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);
  return (
    <>
      <NavBar />
      <Container>
        <h2 className="my-5">Pedidos</h2>
        <div className="text-end">
          <Button className="my-3" variant="primary" onClick={gotoNewOrder}>
            Novo Pedido
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {orders?.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.client}</td>

                <td>
                  <div className="">
                    <Button
                      className=" "
                      onClick={() => selectOrder(order.order_id)}
                      variant="danger"
                      size="sm"
                    >
                      Deletar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Deletar Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>Aviso todos os dados salvos serão deletados.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={deleteOrder}>
            Deletar Pedido
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderPage;
