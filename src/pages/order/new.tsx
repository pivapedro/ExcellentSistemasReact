import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Container, Table } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import IntlCurrencyInput from "react-intl-currency-input";
import { apis } from "../../services";
import { useNavigate } from "react-router-dom";
import { DeviceContext } from "../../store";
import { IProducts } from "../home";
import { useRef } from "react";

type ITransferData = IProducts & {
  quantity?: string | number;
};

const OrderForm = () => {
  const [products, setProducts] = useState<IProducts[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProducts>();
  const [requestProducts, setRequestProducts] = useState<ITransferData[]>([]);
  const [quantity, setQuantity] = useState<number>();
  const [selectedValue, setSelectedValue] = useState<string>("0");

  const [formData, setFormData] = useState<{ client?: string }>({});
  const navigate = useNavigate();

  const getProducts = async () => {
    const { data } = await apis.getProducts();
    setProducts(data);
  };
  const handleSelect = (e) => {
    const product: IProducts = JSON.parse(e.target.value);
    setSelectedValue(e.target.value);
    setSelectedProduct(product);
  };

  const addProductToRequest = () => {
    if (typeof selectedProduct !== "undefined")
      setRequestProducts([
        ...requestProducts,
        { ...selectedProduct, quantity: quantity },
      ]);
    setSelectedValue("0");
    setQuantity(0);
    setSelectedProduct(undefined);
  };

  const removeProductToRequest = (id) => {
    const newArray = requestProducts?.filter(
      (product) => product.product_id !== id
    );
    setRequestProducts(newArray);
  };

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    console.log(requestProducts);
  }, [requestProducts]);
  const formatter = new Intl.NumberFormat("pr-BR", {
    style: "currency",
    currency: "BRL",
  });
  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const { data } = await apis.createOrder({
        ...formData,
        products: requestProducts,
      });

      navigate("/orders");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <NavBar />
      <Container>
        <h2 className="my-5">Novo Pedido</h2>
        <Form onSubmit={handleSubmit} className="row">
          <Form.Group controlId="formStock" className="col-12 my-2">
            <Form.Label>Cliente</Form.Label>
            <Form.Control
              type="text"
              value={formData?.client}
              onChange={(e) =>
                setFormData({ ...formData, client: e.target.value })
              }
            />
          </Form.Group>

          <Form.Group controlId="formStock" className="col-4 my-2">
            <Form.Label>Produto</Form.Label>
            <Form.Select
              aria-label="Default select example"
              onChange={(e) => {
                handleSelect(e);
              }}
              value={selectedValue}
            >
              <option value={0}>Selecione o Produto desejado</option>
              {products?.map((product) => (
                <option
                  key={product.product_id}
                  value={JSON.stringify(product)}
                >
                  {product.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formStock" className="col-8 my-2 row">
            <Form.Label className="col-12">
              Quantidade
              {selectedProduct?.current_inventory
                ? `(máx ${selectedProduct?.current_inventory})`
                : null}
            </Form.Label>
            <Form.Control
              className="mx-2"
              type="number"
              style={{ width: "30%" }}
              max={selectedProduct?.current_inventory}
              min={0}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            {!!selectedProduct?.value && (
              <>
                <Form.Label className="col-3">
                  {selectedProduct?.value ? `Valor: ` : null}
                  {formatter.format(selectedProduct?.value)}
                </Form.Label>
              </>
            )}

            <Button
              className="col-4 "
              variant="primary"
              size="sm"
              onClick={addProductToRequest}
            >
              Adicionar
            </Button>
          </Form.Group>
          <Table striped bordered hover className="my-5">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Quantidade</th>
                <th>Valor</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {requestProducts?.map((product, i) => (
                <tr key={i}>
                  <td>{product.product_id}</td>
                  <td>{product.name}</td>
                  <td>{product.quantity}</td>
                  <td>{formatter.format(product.value)}</td>

                  <td>
                    <div className="text-center">
                      <Button
                        className=" "
                        onClick={() =>
                          removeProductToRequest(product.product_id)
                        }
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

          <div className="text-center">
            <Button variant="primary" type="submit" className="my-3 col-2">
              Criar Pedido
            </Button>
          </div>
        </Form>
      </Container>
    </>
  );
};

export default OrderForm;
