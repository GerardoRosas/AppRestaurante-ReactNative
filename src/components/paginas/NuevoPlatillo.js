import React, { useContext, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {FirebaseContext} from '../../firebase';

import { useNavigate } from 'react-router-dom';
import FileUploader from 'react-firebase-file-uploader';

const NuevoPlatillo = () => {

    //State para las imagenes
    const [ subiendo, guardarSubiendo ] = useState(false);
    const [ progreso, guardarProgreso ] = useState(0);
    const [ urlimagen, guardarUrlImagen ] = useState('');

    //Context con las operaciones de firabase
    const { firebase } = useContext(FirebaseContext);

    //Hook para redireccionar
    const navigate = useNavigate();

    //Validacion y leer los datos del formulario 
    const formik = useFormik({
        initialValues: {
            nombre: '',
            precio: '',
            categoria: '',
            descripcion: '',
            imagen: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                        .min(3, 'Los platillos deben tener 3 caracteres')
                        .required('El nombre del platillo es obligatorio'),
            precio: Yup.number()
                        .min(1,'Debes agregar un precio ')
                        .required('El precio es obligatorio'),
            categoria: Yup.string()
                            .required('La categoria es oblogatoria'),
            descripcion: Yup.string()
                            .min(10, 'La descripción debe ser mas larga')
                            .required('La descripciòn debe ser obligatoria')
        }),
        onSubmit: platillo => {
            try {
                //Se agregan dos propiedades al objeto
                platillo.existencia = true;
                platillo.imagen = urlimagen;
                firebase.db.collection('productos').add(platillo);

                //Agregado correctamente y redireccionar
                navigate('/menu');
            } catch (error) {
                console.log(error);
            }
        }
    })


    //Funciones para la subida de imagenes
    const handleUploadStart = () => {
        guardarProgreso(0);
        guardarSubiendo(true);
    }

    const handleUploadError = error => {
        guardarSubiendo(false)
        console.log(error)
    }

    const handleUploadSuccess = async (nombre) => {
        guardarSubiendo(false);
        guardarProgreso(100);

        //Almacenar la url de destino
        const url = await firebase.storage
                            .ref("productos")
                            .child(nombre)
                            .getDownloadURL();

        console.log(url);
        guardarUrlImagen(url);
    }

    const handleProgress = (progreso) => {
        guardarProgreso(progreso)

        console.log(progreso);
    }


    return (  
        <>
        <h1 className="text-3xl font-light mb-4">Agregar platillo</h1>

        
        <div className="flex justify-center mt-10">
            <div className="w-full max-w-3xl">
                <form
                    onSubmit={formik.handleSubmit}
                >
                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="nombre">Nombre</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="nombre"
                            type="text"
                            placeholder="Nombre Platillo"
                            value={formik.values.nombre}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.nombre && formik.errors.nombre ? (
                        <div className="bd-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-5" role="alert">
                            <p>{formik.errors.nombre}</p>
                        </div>
                    ) : null }

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="precio">Precio</label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="precio"
                            type="number"
                            placeholder="$40"
                            min="0"
                            value={formik.values.precio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                    </div>

                    {formik.touched.precio && formik.errors.precio ? (
                        <div className="bd-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-5" role="alert">
                            <p>{formik.errors.precio}</p>
                        </div>
                    ) : null }

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="nombre">Categoria</label>
                        <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="precio"
                            name="categoria"
                            value={formik.values.categoria}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        >
                            <option value="">--Seleccione--</option>
                            <option value="desayuno">Desayuno</option>
                            <option value="comida">Comida</option>
                            <option value="cena">Cena</option>
                            <option value="bebida">Bebida</option>
                            <option value="postre">Postre</option>
                            <option value="ensaladas">Ensaladas</option>
        
                        </select>
                    </div>

                    {formik.touched.categoria && formik.errors.categoria ? (
                        <div className="bd-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-5" role="alert">
                            <p>{formik.errors.categoria}</p>
                        </div>
                    ) : null }

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="imagen">Imagen</label>
                        <FileUploader
                            accept="image/*"
                            id="imagen"
                            name="imagen"
                            randomizeFilename
                            storageRef={firebase.storage.ref("productos")}
                            onUploadStart={handleUploadStart}
                            onUploadError={handleUploadError}
                            onUploadSuccess={handleUploadSuccess}
                            onProgress={handleProgress}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-600 text-sm font-bold mb-2" htmlFor="descripcion">Descripción</label>
                        <textarea
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-40"
                            id="descripcion"
                            placeholder="Descripción del platillo"
                            value={formik.values.descripcion}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        ></textarea>
                    </div>

                    {formik.touched.descripcion && formik.errors.descripcion ? (
                        <div className="bd-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-5" role="alert">
                            <p>{formik.errors.descripcion}</p>
                        </div>
                    ) : null }

                    <input
                        type="submit"
                        className="bg-gray-800 hover:bg-gray-900 w-full mt-5 p-2 text-white uppercase font-bold"
                        value="Agregar"
                    />
                </form>
            </div>

        </div>

        </>
        
    );
}
 
export default NuevoPlatillo;