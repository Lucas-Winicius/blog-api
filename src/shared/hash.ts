import crypto from 'crypto'
import * as argon2 from 'argon2'

function cryptoCreate(data: string) {
  const hash = crypto.createHash('sha256')

  hash.update(data)
  const digest = hash.digest('hex')

  return digest
}

function cryptoCompare(storedHash: string, plaintext: string) {
  const hash = crypto.createHash('sha256')
  hash.update(plaintext)
  const newDigest = hash.digest('hex')

  return newDigest === storedHash
}

async function create(data: string) {
  try {
    const hash = await argon2.hash(data)
    return { success: true, hash }
  } catch (err) {
    return { success: false, error: err }
  }
}

async function compare(hash: string, data: string) {
  try {
    const hashMatch = await argon2.verify(hash, data)
    if (hashMatch) {
      return {
        match: true,
      }
    } else {
      return {
        match: false,
      }
    }
  } catch (err) {
    return { match: false, error: err }
  }
}

export default { compare, create, cryptoCompare, cryptoCreate }
