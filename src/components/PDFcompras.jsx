import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFCompra = async (compra, detalleCompras) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Colores
    const colorPrimario = [200, 155, 60]; // Dorado #c89b3c
    const colorSecundario = [51, 51, 51]; // Gris oscuro
    const colorTexto = [80, 80, 80];
    
    // ==================== ENCABEZADO ====================
    // Fondo del encabezado
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Título
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA DE COMPRA', pageWidth / 2, 20, { align: 'center' });
    
    // Número de compra
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`No. ${compra.id_Compra || 'N/A'}`, pageWidth / 2, 30, { align: 'center' });
    
    // Estado
    const estado = compra.estado || 'Activo';
    const colorEstado = estado === 'Activo' ? [40, 167, 69] : [220, 53, 69];
    doc.setFillColor(...colorEstado);
    doc.roundedRect(pageWidth / 2 - 20, 34, 40, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.text(estado.toUpperCase(), pageWidth / 2, 39.5, { align: 'center' });
    
    // ==================== INFORMACIÓN DE LA COMPRA ====================
    let yPos = 55;
    
    // Proveedor
    doc.setTextColor(...colorSecundario);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMACIÓN DEL PROVEEDOR', 14, yPos);
    
    yPos += 8;
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(0.5);
    doc.line(14, yPos, pageWidth - 14, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorTexto);
    
    // Datos del proveedor
    const proveedor = compra.proveedor || {};
    doc.text(`Nombre: ${proveedor.nombre || 'N/A'}`, 14, yPos);
    yPos += 6;
    
    if (proveedor.telefono) {
      doc.text(`Telefono: ${proveedor.telefono}`, 14, yPos);
      yPos += 6;
    }
    
    if (proveedor.email) {
      doc.text(`Email: ${proveedor.email}`, 14, yPos);
      yPos += 6;
    }
    
    if (proveedor.direccion) {
      doc.text(`Direccion: ${proveedor.direccion}`, 14, yPos);
      yPos += 6;
    }
    
    if (proveedor.ciudad) {
      doc.text(`Ciudad: ${proveedor.ciudad}`, 14, yPos);
      yPos += 6;
    }
    
    // ==================== INFORMACIÓN DE PAGO ====================
    yPos += 5;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorSecundario);
    doc.text('INFORMACION DE PAGO', 14, yPos);
    
    yPos += 8;
    doc.line(14, yPos, pageWidth - 14, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorTexto);
    
    // Fechas
    const formatearFecha = (fecha) => {
      if (!fecha) return 'N/A';
      try {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch {
        return 'N/A';
      }
    };
    
    doc.text(`Fecha de Compra: ${formatearFecha(compra.fecha_Compra_Proveedor)}`, 14, yPos);
    yPos += 6;
    
    if (compra.fecha_registro) {
      doc.text(`Fecha de Registro: ${formatearFecha(compra.fecha_registro)}`, 14, yPos);
      yPos += 6;
    }
    
    doc.text(`Forma de Pago: ${compra.forma_Pago || 'N/A'}`, 14, yPos);
    yPos += 10;
    
    // ==================== TABLA DE PRODUCTOS ====================
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorSecundario);
    doc.text('PRODUCTOS', 14, yPos);
    
    yPos += 8;
    doc.line(14, yPos, pageWidth - 14, yPos);
    yPos += 5;
    
    // Formatear datos para la tabla
    const productosData = detalleCompras && detalleCompras.length > 0
      ? detalleCompras.map((detalle, index) => {
          // Las propiedades vienen en PascalCase desde el API C#
          const nombreProducto = detalle.Producto?.Nombre || 
                                detalle.producto?.nombre || 
                                `Producto #${detalle.IdProducto || detalle.id_producto || 'N/A'}`;
          
          const cantidad = detalle.Cantidad || detalle.cantidad || 0;
          const precioUnitario = detalle.PrecioUnitario || detalle.precio_unitario || 0;
          const subtotal = detalle.SubtotalProducto || detalle.subtotalProducto || (cantidad * precioUnitario);
          
          return [
            index + 1,
            nombreProducto,
            cantidad,
            `$${Number(precioUnitario).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            `$${Number(subtotal).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          ];
        })
      : [['', 'No hay productos registrados', '', '', '']];
    
    // Crear tabla
    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Producto', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: productosData,
      theme: 'striped',
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: colorTexto
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 },
        1: { halign: 'left', cellWidth: 70 },
        2: { halign: 'center', cellWidth: 25 },
        3: { halign: 'right', cellWidth: 35 },
        4: { halign: 'right', cellWidth: 35 }
      },
      margin: { left: 14, right: 14 }
    });
    
    // ==================== RESUMEN FINANCIERO ====================
    yPos = doc.lastAutoTable.finalY + 10;
    
    // Verificar si hay espacio, sino crear nueva página
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }
    
    // Cuadro de totales
    const xInicio = pageWidth - 80;
    const anchoBox = 66;
    
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(xInicio, yPos, anchoBox, 45, 2, 2, 'F');
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colorTexto);
    
    // Subtotal
    doc.text('Subtotal:', xInicio + 5, yPos);
    doc.text(`$${Number(compra.subtotal || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
             xInicio + anchoBox - 5, yPos, { align: 'right' });
    yPos += 7;
    
    // Descuento (si existe)
    if (compra.descuento && compra.descuento > 0) {
      doc.setTextColor(220, 53, 69);
      doc.text('Descuento:', xInicio + 5, yPos);
      doc.text(`-$${Number(compra.descuento).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
               xInicio + anchoBox - 5, yPos, { align: 'right' });
      yPos += 7;
      doc.setTextColor(...colorTexto);
    }
    
    // IVA
    doc.text('IVA (19%):', xInicio + 5, yPos);
    doc.text(`$${Number(compra.iva || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
             xInicio + anchoBox - 5, yPos, { align: 'right' });
    yPos += 7;
    
    // Línea separadora
    doc.setDrawColor(...colorPrimario);
    doc.setLineWidth(0.8);
    doc.line(xInicio + 5, yPos, xInicio + anchoBox - 5, yPos);
    yPos += 7;
    
    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorPrimario);
    doc.text('TOTAL:', xInicio + 5, yPos);
    doc.text(`$${Number(compra.total || 0).toLocaleString('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, 
             xInicio + anchoBox - 5, yPos, { align: 'right' });
    
    // ==================== PIE DE PÁGINA ====================
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text('Este documento es un comprobante de compra generado electronicamente.', 
             pageWidth / 2, footerY, { align: 'center' });
    doc.text(`Generado el ${new Date().toLocaleDateString('es-CO')} a las ${new Date().toLocaleTimeString('es-CO')}`, 
             pageWidth / 2, footerY + 4, { align: 'center' });
    
    // ==================== GUARDAR PDF ====================
    doc.save(`Factura_Compra_${compra.id_Compra || 'N/A'}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error al generar PDF:', error);
    throw error;
  }
};