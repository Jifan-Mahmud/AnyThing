import { SignJWT, jwtVerify } from "jose-cjs";

const getSecret = () => {
  const secret =
    process.env.JWT_SECRET ||
    process.env.BETTER_AUTH_SECRET ||
    "anything-super-secure-jwt-secret-key-32chars";
  return new TextEncoder().encode(secret);
};

/**
 * Sign a JWT token using jose-cjs
 * @param {object} payload - Data to embed in the JWT
 * @param {string} expiresIn - Expiration format (e.g. "7d", "24h")
 * @returns {Promise<string>}
 */
export async function signToken(payload, expiresIn = "7d") {
  const secret = getSecret();
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verify a JWT token using jose-cjs
 * @param {string} token - The raw JWT token string
 * @returns {Promise<object|null>} - Decoded payload or null if invalid
 */
export async function verifyToken(token) {
  try {
    if (!token) return null;
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}
