import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Mapear a la estructura que usa la app
    const products = data.map((p: any) => ({
      id: p.id,
      badge: p.badge || '',
      emoji: p.emoji || '⚡',
      cat: p.categoria,
      name: p.nombre,
      specs: p.specs ? Object.entries(p.specs).map(([k, v]) => `${v}`) : [],
      stars: 5,
      reviews: 0,
      stock: p.stock > 0 ? `${p.stock} unidades en stock` : 'Agotado',
      price: `$${Number(p.precio_cop).toLocaleString('es-CO')}`,
      priceNum: Number(p.precio_cop),
      iva: p.iva_porcentaje === 5
        ? '✓ IVA 5% · Ley 1964'
        : `IVA ${p.iva_porcentaje}%`,
      note: p.categoria === 'wallbox' ? '+ Instalación desde $350.000' : '',
      description: p.descripcion || '',
      compatible: p.compatible || [],
      inStock: p.stock > 0,
    }))

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching productos:', error)
    return NextResponse.json({ error: 'Error al cargar productos' }, { status: 500 })
  }
}
