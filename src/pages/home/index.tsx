import React, { useContext, useEffect, useState } from "react";
import { Table, Button, Container, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import { apis } from "../../services";
import { DeviceContext } from "../../store";
export interface IProducts {
  product_id: number;
  description: string;
  value: number;
  current_inventory: number;
  name: string;
  images?: {
    image_src: string;
    image_id: string;
  }[];
}
const ProductPage = () => {
  const navigate = useNavigate();
  const { setID, id } = useContext(DeviceContext);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [products, setProducts] = useState<IProducts[]>([]);

  const getProducts = async () => {
    const { data } = await apis.getProducts();
    setProducts(data);
  };
  const gotoNewProduct = () => {
    setID?.(0);
    navigate("product/new");
  };
  const selectProduct = async (id: number) => {
    setID?.(id);
    handleShow();
  };
  const handleEdit = (id: number) => {
    setID?.(id);
    navigate("product/new");
  };

  const deleteProduct = async () => {
    try {
      const { data } = await apis.deleteProduct({ product_id: id });
      console.log(data);
      setID?.(0);
      getProducts();
      handleClose();
    } catch (error) {
      handleClose();
      console.log(error);
    }
  };
  const formatter = new Intl.NumberFormat("pr-BR", {
    style: "currency",
    currency: "BRL",
  });

  useEffect(() => {
    getProducts();
  }, []);
  return (
    <>
      <NavBar />
      <Container>
        <h2 className="my-5">Produtos</h2>
        <div className="text-end">
          <Button className="my-3" variant="primary" onClick={gotoNewProduct}>
            Novo Produto
          </Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Valor</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => (
              <tr key={product.product_id}>
                <td>{product.product_id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{formatter.format(product.value)}</td>
                <td>{product.current_inventory}</td>
                <td>
                  <div className="row">
                    <Button
                      className="col-5 mx-2"
                      size="sm"
                      onClick={() => handleEdit(product.product_id)}
                    >
                      Editar
                    </Button>
                    <Button
                      className="col-5"
                      onClick={() => selectProduct(product.product_id)}
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
          <Modal.Title>Deletar Produto</Modal.Title>
        </Modal.Header>
        <Modal.Body>Aviso todos os dados salvos serão deletados.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={deleteProduct}>
            Deletar Produto
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProductPage;
