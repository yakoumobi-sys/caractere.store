/**
 * Client API Yalidine — Plateforme de livraison Algérienne
 * https://developers.yalidine.app/docs
 */

export interface YalidineConfig {
  apiKey: string;
  apiSecret: string;
  sandbox: boolean; // true pour test, false pour production
}

export interface YalidineShipment {
  delivery_type?: number; // 1 = Yalidine, 2 = Alger Livraison
  pickup_wilaya?: string;
  pickup_location?: string;
  delivery_wilaya: string;
  delivery_location?: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  reference: string; // Votre numéro de commande
  price: number; // Prix du produit
  shipping_price?: number; // Frais de livraison
  items?: Array<{
    name: string;
    quantity: number;
    unit_price: number;
  }>;
  notes?: string;
  has_insurance?: boolean;
  is_cod?: boolean; // Paiement à la livraison
}

export interface YalidineShipmentResponse {
  status: boolean;
  message: string;
  data?: {
    tracking_number: string;
    parcel_number: string;
    delivery_type: string;
    price: number;
    shipping_price: number;
    total_price: number;
  };
  error?: string;
}

export interface YalidineTrackingResponse {
  status: boolean;
  message: string;
  data?: {
    tracking_number: string;
    parcel_number: string;
    status: string;
    status_ar?: string;
    updated_at: string;
    wilaya?: string;
    location?: string;
  };
  error?: string;
}

class YalidineClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor(config: YalidineConfig) {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.baseUrl = config.sandbox
      ? "https://sandbox-api.yalidine.app/api/v1"
      : "https://api.yalidine.app/api/v1";
  }

  /**
   * Créer un nouvel envoi sur Yalidine
   */
  async createShipment(shipment: YalidineShipment): Promise<YalidineShipmentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shipments/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}:${this.apiSecret}`,
        },
        body: JSON.stringify(shipment),
      });

      if (!response.ok) {
        return {
          status: false,
          message: `Erreur HTTP ${response.status}`,
          error: response.statusText,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        status: false,
        message: "Erreur de connexion à Yalidine",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Tracker un envoi par numéro de suivi
   */
  async trackShipment(trackingNumber: string): Promise<YalidineTrackingResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/shipments/track/${trackingNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.apiKey}:${this.apiSecret}`,
          },
        }
      );

      if (!response.ok) {
        return {
          status: false,
          message: `Erreur HTTP ${response.status}`,
          error: response.statusText,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        status: false,
        message: "Erreur de connexion à Yalidine",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Tracker un envoi par numéro de colis
   */
  async trackByParcelNumber(parcelNumber: string): Promise<YalidineTrackingResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/shipments/track_by_parcel/${parcelNumber}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.apiKey}:${this.apiSecret}`,
          },
        }
      );

      if (!response.ok) {
        return {
          status: false,
          message: `Erreur HTTP ${response.status}`,
          error: response.statusText,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        status: false,
        message: "Erreur de connexion à Yalidine",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }

  /**
   * Annuler un envoi
   */
  async cancelShipment(trackingNumber: string): Promise<YalidineShipmentResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/shipments/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}:${this.apiSecret}`,
        },
        body: JSON.stringify({ tracking_number: trackingNumber }),
      });

      if (!response.ok) {
        return {
          status: false,
          message: `Erreur HTTP ${response.status}`,
          error: response.statusText,
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        status: false,
        message: "Erreur de connexion à Yalidine",
        error: error instanceof Error ? error.message : "Erreur inconnue",
      };
    }
  }
}

/**
 * Instancie le client Yalidine avec les credentials de .env
 */
export function getYalidineClient(): YalidineClient {
  const apiKey = process.env.YALIDINE_API_KEY;
  const apiSecret = process.env.YALIDINE_API_SECRET;
  const sandbox = process.env.YALIDINE_SANDBOX === "true";

  if (!apiKey || !apiSecret) {
    throw new Error("YALIDINE_API_KEY et YALIDINE_API_SECRET sont requis dans .env");
  }

  return new YalidineClient({
    apiKey,
    apiSecret,
    sandbox,
  });
}

export default YalidineClient;
