/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {
  CFormSelect,
  CFormCheck,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormLabel,
  CFormText,
} from '@coreui/react'
import { deleteReunion, getReuniones } from '../../../api/reunionApi'
import { getCliente, getClientes } from '../../../api/clienteApi'
import queryClient from '../queryClient'
import { useMutation, useQuery } from 'react-query'

const ReunionCliente = () => {
  const [visible, setModal] = useState(false)
  const [visibleEditar, setVisibleEditar] = useState(false)
  const [reunion, setReunion] = useState({
    idreunion: '',
    nombre: '',
    descripcion:'',
    enlace:''
  });
  const [cliente, setCliente] = useState({
    idcliente: '',
    nombres: '',
    apellidos:'',
  });

  const handleChangeReunion = e => {
    const { name, value } = e.target;
    setReunion(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const {
    isLoading,
    isFetching,
    error,
    data: reunionApi,
  } = useQuery('reunions', getReuniones)

  const {
    data: clienteApi,
  } = useQuery('clientes', getClientes)

  const agregar = () => {
    setReunion({
      idreunion: '',
      nombre: '',
      descripcion:'',
      enlace:''
    });
    setModal(!visible);
  }

  const { mutate } = useMutation(deleteReunion, {
    onSuccess: () => {
      queryClient.invalidateQueries('reunion')
    },
  })

  const handleChange = e => {
    const { name, value } = e.target;
    setReunion(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  const Grabar2 = ()=>{
    fetch("http://localhost:4000/reuniones", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(reunion),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("Reunión grabada correctamente");
    setModal(!visible);
  }

  const Grabar = () => {
    // alert("reunion grabada correctamente");
    // useMutation(Grabar2());
  };

  const [client, setClient] = useState([]);

  const add=(idcliente, e)=>{
    console.log(e.target.checked);
    if (e.target.checked == false) {
      for (let i =0; i < client.length; i++){
        if (client[i].idcliente === idcliente)
          client.splice(i,1);
      }
    }else{
      client.push({
        idcliente:idcliente,
        idreunion:reunion.idreunion
      });
    }
    console.log(client)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Reunión - Clientes</strong>&nbsp;&nbsp;
            <CButton onClick={() => Grabar()}>Grabar</CButton>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Aqui se van a agendar las reuniones con los clientes.
            </p>

            <CFormSelect custom name="idreunion" value={reunion.idreunion} id={reunion.idreunion} onChange={handleChangeReunion}>
              <option value="">--Seleccione una Reunión--</option>
              {
                reunionApi?.map(i => (
                  <option key={i.idreunion} value={i.idreunion}>{i.nombre}</option>
                ))
              }
            </CFormSelect>

            {/* <CFormSelect custom name="idcliente" value={cliente.idcliente} id={cliente.nombres} onChange={handleChangeCliente}>
              <option value="">--Seleccione un cliente--</option>
              {
                clienteApi?.map(i => (
                  <option key={i.idcliente} value={i.idcliente}>{i.nombres}</option>
                ))
              }
            </CFormSelect> */}

            <br/>
              {
                clienteApi?.map(x => (
                  <CFormCheck key={x.idcliente} onChange={(e) => add(x.idcliente,e)} name="idcliente" label={x.nombrecompleto}  />
              ))}
              
          </CCardBody>
        </CCard>
      </CCol>

      {/* <CModal visible={visible} onClose={() => setModal(false)}>
        <CModalHeader onClose={() => setModal(false)}>
          <CModalTitle>Agregar Reunión</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput name="nombre"
              type="text"
              value={reunion.nombre}
              onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Descripcion:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="descripcion" value={reunion.descripcion} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Enlace:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="enlace" value={reunion.enlace} onChange={handleChange} />
          </CCol>
        </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setModal(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={() => Grabar()}>Grabar</CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={visibleEditar} onClose={() => setVisibleEditar(false)}>
        <CModalHeader onClose={() => setVisibleEditar(false)}>
          <CModalTitle>Editar Reunión</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombre:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="idreunion" value={reunion.idreunion} hidden />
            <CFormInput type="text" name="nombre" value={reunion.nombre} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Descripción:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="descripcion" value={reunion.descripcion} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Enlace:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="enlace" value={reunion.enlace} onChange={handleChange} />
          </CCol>
        </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setVisibleEditar(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={() => Modificar()}>Grabar</CButton>
        </CModalFooter>
      </CModal> */}
    </CRow>
  )
}

export default ReunionCliente
