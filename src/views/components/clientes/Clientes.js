/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import {
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

// import useModalContext from 'hooks/useModalContext'
import { deleteCliente, getClientes } from '../../../api/clienteApi'
import queryClient from '../queryClient'
import { useMutation, useQuery } from 'react-query'

const Clientes = () => {
  const [visible, setModal] = useState(false)
  const [visibleEditar, setVisibleEditar] = useState(false)
  const [cliente, setCliente] = useState({
    idcliente: '',
    nombres: '',
    apellidos:''
  });

  const {
    isLoading,
    isFetching,
    error,
    data: clienteApi,
  } = useQuery('clientes', getClientes)

  const agregar = () => {
    setCliente({
      // nutriologistId:localStorage.getItem("id"),
      idcliente: '',
      nombres: '',
      apellidos:''
    });
    setModal(!visible);
  }

  const { mutate } = useMutation(deleteCliente, {
    onSuccess: () => {
      queryClient.invalidateQueries('clientes')
    },
  })

  const handleDelete = cliente => event => {
    event.stopPropagation()

    if (window.confirm('¿Está seguro que desea borrar este cliente?')) {
      mutate(cliente.idcliente)
      // alert(cliente.idcliente);
    }
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setCliente(prevState => ({
      ...prevState,
      [name]: value,
    }))
  }

  const Modificar = () => {
    useMutation(Actualizar());
  };

  const editarCliente = (item) => {
    setCliente(item);
    setVisibleEditar(!visibleEditar)
  }

  const Actualizar = ()=>{
    fetch(`http://localhost:4000/clientes/${cliente.idcliente}`, {
      method: 'PUT',
      body: JSON.stringify(cliente), // data can be `string` or {object}!
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("cliente actualizado correctamente");
    setVisibleEditar(!visibleEditar);
  }

  const Grabar2 = ()=>{
    fetch("http://localhost:4000/clientes", {
      method: 'POST', // or 'PUT'
      body: JSON.stringify(cliente),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', response));
    alert("cliente grabado correctamente");
    setModal(!visible);
  }

  const Grabar = () => {
    useMutation(Grabar2());
  };

  //Búsqueda de items en la tabla
  const search=()=> {
    var tableReg = document.getElementById('regTable');
        var searchText = document.getElementById('searchTerm').value.toLowerCase();
        for (var i = 1; i < tableReg.rows.length; i++) {
            var cellsOfRow = tableReg.rows[i].getElementsByClassName('td');
            var found = false;
            for (var j = 0; j < cellsOfRow.length && !found; j++) {
                var compareWith = cellsOfRow[j].innerHTML.toLowerCase();
                if (searchText.length == 0 || (compareWith.indexOf(searchText) > -1)) {
                    found = true;
                }
            }
            if (found) {
                tableReg.rows[i].style.display = '';
            } else {
                tableReg.rows[i].style.display = 'none';
            }
    }
  }

  return (
    <CRow>
          <div className='row'>
            <input id="searchTerm"
               type="text"
               autoComplete='off'
               className='form-control mb-2'
               placeholder='Ingrese su búsqueda...'
               onKeyUp={search} />
          </div>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Clientes</strong>&nbsp;&nbsp;
            <CButton onClick={() => agregar()}>Agregar</CButton>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Informacion de los clientes.
            </p>
            {/* <DocsExample href="components/table"> */}
              <CTable id='regTable'>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Nombres</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Apellidos</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Opciones</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {
                  clienteApi?.map(x => (
                  <CTableRow key={x.id}>
                    <CTableDataCell className='td' scope="row">{x.nombres}</CTableDataCell>
                    <CTableDataCell className='td'>{x.apellidos}</CTableDataCell>
                    <CTableDataCell className='td'>
                      {/* <CButton onClick={handleEdit(x)}>Editar</CButton> */}
                      <CButton onClick={() => editarCliente(x)}>Editar</CButton>
                      <CButton className='success' onClick={handleDelete(x)}>Eliminar</CButton>
                    </CTableDataCell>
                  </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            {/* </DocsExample> */}
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={visible} onClose={() => setModal(false)}>
        <CModalHeader onClose={() => setModal(false)}>
          <CModalTitle>Agregar cliente</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Nombres:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput name="nombres"
              type="text"
              value={cliente.nombres}
              onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Apellidos:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput  type="text" name="apellidos" value={cliente.apellidos} onChange={handleChange} />
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
          <CModalTitle>Editar cliente</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">cliente:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="idcliente" value={cliente.idcliente} hidden />
            <CFormInput type="text" name="nombres" value={cliente.nombres} onChange={handleChange} />
          </CCol>
        </CRow>
        <CRow className="g-12 align-items-center">
          <CCol md="2">
            <CFormLabel htmlFor="inputPassword6" className="col-form-label">Clave:</CFormLabel>
          </CCol>
          <CCol md="8">
            <CFormInput type="text" name="apellidos" value={cliente.apellidos} onChange={handleChange} />
          </CCol>
        </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => setVisibleEditar(false)}>
            Cancelar
          </CButton>
          <CButton color="success" onClick={() => Modificar()}>Grabar</CButton>
        </CModalFooter>
      </CModal>
    </CRow>
  )
}

export default Clientes
