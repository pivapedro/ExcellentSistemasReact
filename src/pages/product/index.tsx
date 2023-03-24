import React, { useContext, useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import NavBar from "../../components/NavBar";
import IntlCurrencyInput from "react-intl-currency-input";
import { apis } from "../../services";
import { useNavigate } from "react-router-dom";
import { DeviceContext } from "../../store";

const ProductForm = () => {
  const { setID, id } = useContext(DeviceContext);

  const navigate = useNavigate();
  const [description, setDescription] = useState("");
  const [value, setValue] = useState(0);
  const [currentInventory, setCurrentInventory] = useState("");
  const [images, setImages] = useState("");
  const [name, setName] = useState("");

  const setImage = async (file: File) => {
    const data = new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
    const base = await data;

    setImages(String(base).split("base64,")[1]);
  };
  const handleChange = (event, value, maskedValue) => {
    event.preventDefault();

    setValue(value);
  };

  const getProduct = async () => {
    const { data } = await apis.getOneProduct({ product_id: id });
    console.log(data);
    setCurrentInventory(data.current_inventory);
    setDescription(data.description);
    setValue(data.value);
    setName(data.name);
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const { data } = !id
        ? await apis.createProduct({
            description,
            value,
            current_inventory: currentInventory,
            image_src: images,
            name,
          })
        : await apis.updateProducts({
            description,
            value,
            current_inventory: currentInventory,
            image_src: images,
            product_id: id,
            name,
          });

      navigate("/");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, []);
  return (
    <>
      <NavBar />
      <Container>
        <h2 className="my-5">{!id ? "Novo" : "Editar"} Produto</h2>
        <Form onSubmit={handleSubmit} className="row">
          <Form.Group controlId="formStock" className="col-6 my-2">
            <Form.Label>Nome</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formValue" className="col-6 my-2">
            <Form.Label>Valor</Form.Label>
            <IntlCurrencyInput
              /* @ts-ignore */
              className="form-control"
              config={{
                locale: "pt-BR",
                formats: {
                  number: {
                    BRL: {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    },
                  },
                },
              }}
              onChange={handleChange}
              defaultValue={value}
              max={100000}
              currency="BRL"
            />
          </Form.Group>

          <Form.Group controlId="formStock" className="col-6 my-2">
            <Form.Label>Estoque</Form.Label>
            <Form.Control
              type="number"
              value={currentInventory}
              onChange={(e) => setCurrentInventory(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formImages" className="col-6 my-2">
            <Form.Label>Imagens</Form.Label>
            <input
              className="form-control"
              type="file"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                e?.target?.files?.length ? setImage(e?.target?.files[0]) : null
              }
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="col-12 my-2">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <div className="text-center">
            <Button variant="primary" type="submit" className="my-3 col-2">
              {!id ? "Criar" : "Salvar"} Produto
            </Button>
          </div>
          {/*   <Button variant="primary" type="submit" className="my-3">
            Submit
          </Button> */}
        </Form>
      </Container>
    </>
  );
};

export default ProductForm;
