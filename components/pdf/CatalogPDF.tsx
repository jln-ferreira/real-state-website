import React from 'react'
import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import type { Property } from '@/data/properties'

const BRAND = '#6B6B99'
const DARK  = '#4A5240'
const MUTED = '#9898BB'
const LIGHT = '#F5F0E8'
const NAVY  = '#1E3A5F'

const FEATURE_LABELS: Record<string, string> = {
  balcony:        'Varanda',
  parking:        'Estacionamento',
  gym:            'Academia',
  pool:           'Piscina',
  garden:         'Jardim',
  furnished:      'Mobiliado',
  'pet-friendly': 'Aceita Pets',
  concierge:      'Portaria',
  baccarat:       'Exclusivo Baccarat',
  fireplace:      'Lareira',
  rooftop:        'Cobertura',
  'ev charging':  'Carregador Elétrico',
  storage:        'Depósito',
  elevator:       'Elevador',
  security:       'Segurança',
  '24h security': 'Segurança 24h',
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
  },
  // Hero image
  heroWrap: { position: 'relative', width: '100%', height: 210 },
  heroImg:  { width: '100%', height: 210, objectFit: 'cover' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.50)',
    padding: '10 16 10 16',
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
  },
  price: { color: '#ffffff', fontSize: 20, fontFamily: 'Helvetica-Bold' },
  priceSub: { color: 'rgba(255,255,255,0.75)', fontSize: 9, marginTop: 2 },
  badgeRow: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 },
  badge: {
    backgroundColor: NAVY, color: '#fff',
    fontSize: 9, fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 4,
  },
  badgeType: {
    backgroundColor: BRAND, color: '#fff',
    fontSize: 8,
    paddingHorizontal: 6, paddingVertical: 3,
    borderRadius: 4,
  },
  // Body
  body: { padding: '12 20 0 20', flex: 1, display: 'flex', flexDirection: 'column' },
  title: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: DARK, marginBottom: 2 },
  address: { fontSize: 9, color: MUTED, marginBottom: 4 },
  refRow: { display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  refBadge: {
    backgroundColor: NAVY, color: '#fff',
    fontSize: 8, fontFamily: 'Helvetica-Bold',
    paddingHorizontal: 6, paddingVertical: 2,
    borderRadius: 3, marginRight: 6,
  },
  // Stats row
  statsRow: {
    display: 'flex', flexDirection: 'row', gap: 6, marginBottom: 10,
    backgroundColor: LIGHT, borderRadius: 8, padding: '7 10',
  },
  stat: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' },
  statVal: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: DARK },
  statLbl: { fontSize: 7, color: MUTED, marginTop: 2 },
  divider: { height: 1, backgroundColor: '#E0DACE', marginBottom: 10 },
  // Section label
  sectionLabel: { fontSize: 8, fontFamily: 'Helvetica-Bold', color: BRAND, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 5 },
  // Description
  desc: { fontSize: 9, color: '#555', lineHeight: 1.55, marginBottom: 10 },
  // Features
  featuresWrap: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 10 },
  featureChip: {
    backgroundColor: LIGHT, borderRadius: 4,
    paddingHorizontal: 7, paddingVertical: 3,
    fontSize: 8, color: DARK,
  },
  // Gallery
  galleryRow: { display: 'flex', flexDirection: 'row', gap: 5, marginBottom: 10 },
  galleryImgWrap: { flex: 1, height: 90, backgroundColor: '#F0F0F0', borderRadius: 5, overflow: 'hidden' },
  galleryImg: { width: '100%', height: '100%', objectFit: 'contain' },
  // Agent
  agentBox: {
    backgroundColor: LIGHT, borderRadius: 8, padding: '8 12', marginBottom: 10,
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  agentLabel: { fontSize: 7, color: MUTED, marginBottom: 2 },
  agentName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: DARK },
  agentContact: { fontSize: 8, color: BRAND },
  // Footer
  footer: {
    borderTopWidth: 1, borderTopColor: '#E0DACE', borderTopStyle: 'solid',
    padding: '7 20',
    display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: LIGHT,
    marginTop: 'auto',
  },
  footerBrand: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: BRAND },
  footerId:    { fontSize: 8, color: MUTED },
  footerCta:   { fontSize: 8, color: MUTED },
})


function formatPrice(p: Property): string {
  const amount = p.price.amount.toLocaleString('pt-BR')
  const suffix = p.price.type === 'rent' ? '/mês' : ''
  return `${p.price.currency} ${amount}${suffix}`
}

function PropertyPage({ p }: { p: Property }) {
  const isSale     = p.price.type === 'sale'
  const galleryImgs = (p.media?.images ?? []).filter(Boolean).slice(1, 5) // skip hero, show next 4
  const features   = (p.features ?? []).filter(Boolean)

  const typeLabel: Record<string, string> = {
    house: 'Casa', apartment: 'Apartamento', condo: 'Condomínio',
    commercial: 'Comercial', land: 'Terreno', townhouse: 'Sobrado',
  }

  return (
    <Page size="A4" style={styles.page}>
      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <View style={styles.heroWrap}>
        {p.img ? (
          <Image src={p.img} style={styles.heroImg} />
        ) : (
          <View style={[styles.heroImg, { backgroundColor: '#E0DACE' }]} />
        )}
        <View style={styles.heroOverlay}>
          <View>
            <Text style={styles.price}>{formatPrice(p)}</Text>
            <Text style={styles.priceSub}>{isSale ? 'Preço de Venda' : 'Aluguel Mensal'}</Text>
          </View>
          <View style={styles.badgeRow}>
            <Text style={styles.badge}>{isSale ? 'VENDA' : 'ALUGUEL'}</Text>
            {p.propertyDetails.type && (
              <Text style={styles.badgeType}>{typeLabel[p.propertyDetails.type] ?? p.propertyDetails.type}</Text>
            )}
          </View>
        </View>
      </View>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <View style={styles.body}>

        {/* Title & ref */}
        <Text style={styles.title}>{p.title}</Text>
        <Text style={styles.address}>
          {p.location.address ?? p.location.residential}{p.location.city ? `, ${p.location.city}` : ''}{p.location.province ? ` — ${p.location.province}` : ''}
        </Text>
        <View style={styles.refRow}>
          <Text style={styles.refBadge}>Ref: {p.id}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {p.propertyDetails.bedrooms > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.propertyDetails.bedrooms}</Text>
              <Text style={styles.statLbl}>Suítes</Text>
            </View>
          )}
          {p.propertyDetails.lavabo != null && p.propertyDetails.lavabo > 0 && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.propertyDetails.lavabo}</Text>
              <Text style={styles.statLbl}>Lavabo</Text>
            </View>
          )}
          <View style={styles.stat}>
            <Text style={styles.statVal}>{p.propertyDetails.areaSqFt.toLocaleString()}</Text>
            <Text style={styles.statLbl}>m²</Text>
          </View>
          {p.features?.includes('parking') && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>✓</Text>
              <Text style={styles.statLbl}>Estac.</Text>
            </View>
          )}
          {p.propertyDetails.yearBuilt && (
            <View style={styles.stat}>
              <Text style={styles.statVal}>{p.propertyDetails.yearBuilt}</Text>
              <Text style={styles.statLbl}>Ano</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Description */}
        {p.description ? (
          <>
            <Text style={styles.sectionLabel}>Descrição</Text>
            <Text style={styles.desc}>{p.description}</Text>
          </>
        ) : null}

        {/* Features */}
        {features.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Diferenciais</Text>
            <View style={styles.featuresWrap}>
              {features.map(f => (
                <Text key={f} style={styles.featureChip}>
                  {FEATURE_LABELS[f] ?? f}
                </Text>
              ))}
            </View>
          </>
        )}

        {/* Gallery */}
        {galleryImgs.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Galeria</Text>
            <View style={styles.galleryRow}>
              {galleryImgs.map((img, i) => (
                <View key={i} style={styles.galleryImgWrap}>
                  <Image src={img} style={styles.galleryImg} />
                </View>
              ))}
            </View>
          </>
        )}

        {/* Agent */}
        {p.agent && (
          <View style={styles.agentBox}>
            <View>
              <Text style={styles.agentLabel}>Corretor responsável</Text>
              <Text style={styles.agentName}>{p.agent.name}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.agentContact}>{p.agent.phone}</Text>
              <Text style={[styles.agentContact, { marginTop: 2 }]}>{p.agent.email}</Text>
            </View>
          </View>
        )}

      </View>

      {/* ── Footer ───────────────────────────────────────────────────────────── */}
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
