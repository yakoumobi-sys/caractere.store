# ERP Caractère — Structure Complète

## 📋 Vue d'ensemble

Cet ERP gère le flux complet de commandes pour Caractère (entreprise de personalisation de vêtements):

```
WhatsApp (Lilia/Lydia) 
  → Commercial (Kholoud/Abderahmane/Hafid)
    → Atelier DTF (Imène/Nesro) OU Broderie (Manel)
      → Flocage (Ikram/Hanane/Aymene)
        → Commercial (livraison)
          → Yalidine/Alger (livraison + paiement)
            → Client
```

## 🗄️ Structure de la base de données

### Tables principales

#### `pipeline_orders` - Commandes en production
- `id`: UUID unique
- `number`: Numéro auto-généré (CMD-YYYY-00001)
- `contact_id`: Référence au client
- `technique`: "dtf" | "broderie" | "aucune"
- `status`: Statut de la commande (voir ci-dessous)
- `assigned_to`: UUID de l'employé responsable
- **`amount_paid`**: Montant versé par le client (DA)
- **`delivery_confirmed_at`**: Timestamp de confirmation de récupération
- **`paid_at`**: Timestamp de paiement complet

#### Statuts de commande (10 étapes + livraison)
1. `attente_dtf` → Attendant traitement DTF
2. `impression_dtf` → En impression DTF
3. `attente_broderie` → Attente broderie
4. `en_broderie` → En broderie
5. `attente_gros` → Attente préparation gros
6. `en_preparation_gros` → En préparation
7. `prete` → Prête à livrer
8. **`livree`** → Chez Yalidine/Alger ✨ NEW
9. **`attente_yalidine`** → En attente de récupération client ✨ NEW
10. **`payee`** → Livrée et payée ✨ NEW

#### `pipeline_order_items` - Articles dans commande
- Produit, couleur, taille, quantité

#### `pipeline_order_prints` - Personnalisations
- Placement logo, taille, contenu texte

#### `contacts` - Clients/Fournisseurs
- Informations contact principales

#### `employees` - Employés
- Prénom, département, rôle
- **`color`**: Couleur assignée pour l'UI (ex: #EF4444)

#### `production_tasks` - Checklist de production
- Tâches liées aux commandes avec statut

#### `claims` - Réclamations/Problèmes
- Numéro auto-généré (REC-YYYY-00001)
- Type, priorité, résolution

#### `pipeline_comments` - Collaboration
- Commentaires et notes sur commandes

### Tables de support
- `chart_of_accounts` - Plan comptable
- `journal_entries` - Écritures comptables auto-générées
- `products` - Catalogue de produits
- `product_categories` - Catégories
- `product_stock_levels` - Stock par taille/couleur
- `warehouses` - Entrepôts

## 📁 Structure du code

```
caractere-full/
├── lib/
│   ├── pipeline.ts          # Définition états + enums
│   ├── colors.ts            # Palette couleurs employés
│   ├── actions/
│   │   └── pipeline-actions.ts  # Server actions pour commandes
│   └── supabase/
│       └── server.ts        # Client Supabase
├── components/
│   ├── ui.tsx               # Composants de base (Button, Card, etc.)
│   └── production/
│       └── order-details-fields.tsx  # Formulaire 3 étapes avec versement ✨
├── app/
│   └── production/
│       └── new/
│           └── page.tsx     # Page création commande
└── supabase/
    └── migrations/
        ├── 0001_init.sql           # Schéma initial
        └── 0002_functions_triggers.sql  # Auto-numérotation + triggers
```

## ✨ Nouvelles fonctionnalités

### 1. Champ "Versement" (montant payé)
À la création de commande, on peut saisir le montant versé par le client.
```tsx
<Field label="Versement (DA)" htmlFor="amount_paid">
  <input type="number" step="0.01" min="0" />
</Field>
```

### 2. Workflow Yalidine/Alger
Après "Prête à livrer", la commande passe par:
- `livree` → Chez Yalidine/Alger
- `attente_yalidine` → En attente de récupération du client
- `payee` → Livrée ET payée (confirmation auto)

### 3. Triggers Supabase
- ✅ **Auto-numérotation**: CMD-2026-00001, REC-2026-00001
- ✅ **Paiement automatique**: Quand `delivery_confirmed_at` est rempli → `paid_at` = now()
- ✅ **Écritures comptables**: Quand status = "payee" → création lignes journal (Trésorier + Ventes)
- ✅ **updated_at**: Automatique sur chaque update

## 🚀 Prochaines étapes

### À implémenter (priorité haute)

1. **Pages Production**
   - [ ] `/production` - Liste des files (DTF, Broderie, Gros, Prêtes, **Yalidine**)
   - [ ] `/production/[id]` - Détail commande avec versement + livraison
   - [ ] `/production/dtf`, `/broderie`, `/gros`, `/ready` - Files individuelles
   - [ ] `/production/delivery` - Queue Yalidine avec confirmation

2. **Système d'authentification**
   - [ ] Supabase Auth (email/password)
   - [ ] Row Level Security (RLS) avec 8 rôles
   - [ ] assignation auto. employé connecté

3. **Tableau de bord**
   - [ ] Dashboard: Résumé (files, employés, chiffre d'affaires)
   - [ ] Alertes (commandes > 3j même statut)
   - [ ] KPIs employés (actions, fautes, qualité)

4. **Pages supplémentaires**
   - [ ] CRM: Clients, Prospects, Contacts
   - [ ] Comptabilité: Journal, Grand-livre, Bilan
   - [ ] Inventaire: Produits, Stock, Mouvements
   - [ ] RH: Employés, Présence, Performances
   - [ ] Réclamations: Liste, Détail, Résolution

5. **UI & UX**
   - [ ] Dark mode (localStorage)
   - [ ] Couleur assignée à chaque employé (bordure commande)
   - [ ] Responsive design (mobile commercial en atelier)
   - [ ] Notifications temps réel (Supabase Realtime)

### À configurer

- [ ] Variables d'env Supabase (.env.local)
- [ ] Seed initial (employés, clients, produits)
- [ ] Supabase Storage pour logos/images
- [ ] Webhooks Yalidine (optionnel)

## 💾 Déploiement

```bash
# Installation
npm install

# Dev local
npm run dev

# Build production
npm build
npm start

# Migrations Supabase
# → Copier contenu migrations/*.sql dans Supabase SQL Editor
```

## 🎨 Palette couleurs

- **Brand**: Violet #7c3aed
- **Employés**: 12 couleurs (Rouge, Orange, Ambre, Citron, Vert, Émeraude, Sarcelle, Cyan, Ciel, Bleu, Rose, Ardoise)

## 📞 Support

Pour questions ou bugs → contact@caractereinc.com ou WhatsApp
