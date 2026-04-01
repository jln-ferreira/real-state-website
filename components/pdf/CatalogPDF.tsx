import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { Property } from '@/data/properties'

const BRAND = '#6D6D85'
const DARK  = '#2E2E3A'
const MUTED = '#A3A3C2'
const LIGHT = '#F7F7FA'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
  },
  // Hero image
  heroWrap: { position: 'relative', width: '100%', height: 240 },
  heroImg:  { width: '100%', height: 240, objectFit: 'cover' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: '12 16 10 16',
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  price: { color: '#ffffff', fontSize: 22, fontFamily: 'Helvetica-Bold' },
  badge: {
    backgroundColor: BRAND, color: '#fff',
    fontSize: 9, fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4,
  },
  // Body
  body: { padding: '14 20 0 20', flex: 1, display: 'flex', flexDirection: 'column' },
  title: { fontSize: 15, fontFamily: 'Helvetica-Bold', color: DARK, marginBottom: 3 },
  address: { fontSize: 10, color: MUTED, marginBottom: 12 },
  // Stats row
  statsRow: {
    display: 'flex', flexDirection: 'row', gap: 8, marginBottom: 12,
    backgroundColor: LIGHT, borderRadius: 8, padding: '8 12',
  },
  stat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statVal: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: DARK },
  statLbl: { fontSize: 8, color: MUTED, marginTop: 2 },
  // Description
  descLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: BRAND, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  desc: { fontSize: 9, color: '#555', lineHeight: 1.5, marginBottom: 12 },
  // Gallery
  galleryLabel: { fontSize: 9, fontFamily: 'Helvetica-Bold', color: BRAND, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  galleryRow: { display: 'flex', flexDirection: 'row', gap: 6, marginBottom: 12 },
  galleryImg: { flex: 1, height: 72, objectFit: 'cover', borderRadius: 6 },
  // Footer
  footer: {
    borderTopWidth: 1, borderTopColor: '#E6E6EF', borderTopStyle: 'solid',
    padding: '8 20',
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: LIGHT,
    marginTop: 'auto',
  },
  footerBrand: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: BRAND },
  footerId: { fontSize: 8, color: MUTED, fontFamily: 'Helvetica' },
  footerCta: { fontSize: 8, color: MUTED },
})

function sqftToM2(sqft: number) { return Math.round(sqft * 0.0929) }

function formatPrice(p: Property): string {
  const amount = p.price.amount.toLocaleString('en-CA')
  const suffix = p.price.type === 'rent' ? '/mês' : ''
  return `${p.price.currency} ${amount}${suffix}`
}

function PropertyPage({ p }: { p: Property }) {
  const isSale = p.price.type === 'sale'
  const galleryImgs = (p.media?.images ?? []).filter(Boolean).slice(0, 4)
  const desc = p.description?.length > 320 ? p.description.slice(0, 317) + '…' : (p.description ?? '')

  return (
    <Page size="A4" style={styles.page}>
      {/* Hero */}
      <View style={styles.heroWrap}>
        {p.img ? (
          <Image src={p.img} style={styles.heroImg} />
        ) : (
          <View style={[styles.heroImg, { backgroundColor: '#E6E6EF' }]} />
        )}
        <View style={styles.heroOverlay}>
          <Text style={styles.price}>{formatPrice(p)}</Text>
          <Text style={styles.badge}>{isSale ? 'VENDA' : 'ALUGUEL'}</Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Text style={styles.title}>{p.title}</Text>
        <Text style={styles.address}>{p.location.address}, {p.location.city} — {p.location.province}</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          {p.propertyDetails.bedrooms > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.propertyDetails.bedrooms}</Text>
              <Text style={styles.statLbl}>Quartos</Text>
            </View>
          )}
          {p.propertyDetails.bathrooms > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.propertyDetails.bathrooms}</Text>
              <Text style={styles.statLbl}>Banheiros</Text>
            </View>
          )}
          <View style={styles.stat}>
            <Text style={styles.statVal}>{sqftToM2(p.propertyDetails.areaSqFt).toLocaleString()}</Text>
            <Text style={styles.statLbl}>m²</Text>
          </View>
          {p.propertyDetails.yearBuilt && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.propertyDetails.yearBuilt}</Text>
              <Text style={styles.statLbl}>Ano</Text>
            </View>
          )}
        </View>

        {/* Description */}
        {desc ? (
          <>
            <Text style={styles.descLabel}>Descrição</Text>
            <Text style={styles.desc}>{desc}</Text>
          </>
        ) : null}

        {/* Gallery */}
        {galleryImgs.length > 0 && (
          <>
            <Text style={styles.galleryLabel}>Galeria</Text>
            <View style={styles.galleryRow}>
              {galleryImgs.map((img, i) => (
                <Image key={i} src={img} style={styles.galleryImg} />
              ))}
            </View>
          </>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerBrand}>Casa Baccarat</Text>
        <Text style={styles.footerCta}>Entre em contato para mais informações</Text>
        <Text style={styles.footerId}>{p.id}</Text>
      </View>
    </Page>
  )
}

export function CatalogPDF({ properties }: { properties: Property[] }) {
  return (
    <Document title="Catálogo de Imóveis — Casa Baccarat" author="Casa Baccarat">
      {properties.map(p => <PropertyPage key={p.id} p={p} />)}
    </Document>
  )
}
