import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import mongoose from 'mongoose'

const app = express()
const port = process.env.PORT || 3001

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30 },
  program: { type: String, required: true, enum: ['Strength & conditioning', 'Fat loss coaching', 'Athletic performance', 'Not sure yet'] },
  goal: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true, versionKey: false })

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema)

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '10kb' }))

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok', database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.post('/api/bookings', async (request, response) => {
  if (mongoose.connection.readyState !== 1) {
    return response.status(503).json({ message: 'Booking is temporarily unavailable. Please try again shortly.' })
  }

  try {
    const booking = await Booking.create(request.body)
    return response.status(201).json({ id: booking.id, message: 'Your consultation request is confirmed.' })
  } catch (error) {
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return response.status(400).json({ message: 'Please check your details and try again.' })
    }
    console.error('Booking submission failed:', error.message)
    return response.status(500).json({ message: 'We could not save your request. Please try again.' })
  }
})

app.use((error, _request, response, _next) => {
  if (error instanceof SyntaxError && 'body' in error) {
    return response.status(400).json({ message: 'Please submit valid form details.' })
  }
  console.error('API request failed:', error.message)
  return response.status(500).json({ message: 'Something went wrong. Please try again.' })
})

const server = app.listen(port, () => console.log(`PulseFit API listening on http://localhost:${port}`))

if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection failed:', error.message))
} else {
  console.warn('MONGODB_URI is not set; booking submissions will be unavailable.')
}

const shutdown = async () => {
  server.close()
  await mongoose.disconnect()
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)