import { z } from "zod"
import { TsFieldDef } from "./types"

export function generateZodSchema(fields: Record<string, TsFieldDef>) {
  const shape: Record<string, z.ZodTypeAny> = {}

  Object.entries(fields).forEach(([key, def]) => {
    if (def.type === 'separator' || def.type === 'empty' || def.type === 'button') {
        return
    }

    let schema: z.ZodTypeAny

    switch (def.type) {
      case 'number':
      case 'slider':
        schema = z.number()
        if (def.min !== undefined) schema = (schema as z.ZodNumber).min(def.min)
        if (def.max !== undefined) schema = (schema as z.ZodNumber).max(def.max)
        
        // Pokud není required, povolíme null/undefined
        if (!def.required) {
            schema = schema.nullish()
        }
        break

      case 'checkbox':
      case 'switch':
        schema = z.boolean().default(false)
        break
      
      case 'date':
      case 'datetime':
         schema = z.date()
         if (!def.required) schema = schema.nullish()
         break

      default: // text, select, etc. (mostly strings)
        schema = z.string()
        if (def.required) {
            schema = (schema as z.ZodString).min(1, { message: "Toto pole je povinné" })
        } else {
            schema = schema.optional().or(z.literal(''))
        }
        break
    }

    shape[key] = schema
  })

  return z.object(shape)
}
