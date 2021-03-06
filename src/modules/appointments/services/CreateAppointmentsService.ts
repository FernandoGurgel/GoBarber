import { getCustomRepository } from 'typeorm'
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment'
import { startOfHour } from 'date-fns'
import AppointmentsRepository from '@modules/appointments/repositories/AppointmentsRepository'
import AppError from '@shared/errors/AppError'

interface AppointmentDTO {
  provider_id: string
  date: Date
}

class CreateAppointmentsService {
  public async execute({
    date,
    provider_id,
  }: AppointmentDTO): Promise<Appointment> {
    const parsedDate = startOfHour(date)
    const appointmentsRepository = getCustomRepository(AppointmentsRepository)

    const findAppointmentSameDate = await appointmentsRepository.findByDate(
      parsedDate,
    )

    if (findAppointmentSameDate) {
      throw new AppError('This appointment is already booked')
    }

    const appointment = appointmentsRepository.create({
      provider_id,
      date: parsedDate,
    })

    await appointmentsRepository.save(appointment)

    return appointment
  }
}

export default CreateAppointmentsService
