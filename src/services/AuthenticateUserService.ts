import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'
import User from '../models/User'

interface UserDTO {
  email: string
  password: string
}

interface Response {
  user: User
}

class AuthenticateUserService {
  public async execute({ email, password }: UserDTO): Promise<Response> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({
      where: { email },
    })

    if (!user) {
      throw new Error('Incorrect email/password combination.')
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.')
    }

    delete user.password

    return { user }
  }
}

export default AuthenticateUserService