import { ruolo } from "@prisma/client"

export {}


declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      ruolo?: ruolo
    }
  }
}