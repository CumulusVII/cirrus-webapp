const { getUserPasswordAuth, comparePassword } = require('../utils/authUtil')

module.exports = (User, logger) => {
  const authorizeToken = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      logger.info('Missing authorization header')
      return res.status(401).json({
        message: 'Missing authorization header',
      })
    }
    logger.info('Checking authorization header for the user')
    const { username, password } = getUserPasswordAuth(authHeader)
    logger.info(
      `Checking username and password for user ${username} in db.....`
    )
    const user = await User.findOne({
      where: {
        username,
      },
    })
    if (!user) {
      logger.info(`User ${username} not found`)
      return res.status(401).json({
        message: 'Unauthorized: Invalid username or password',
      })
    }
    const isPasswordMatch = await comparePassword(password, user.password)
    if (!isPasswordMatch) {
      logger.info(`User ${username} password mismatch`)
      return res.status(401).json({
        message: 'Unauthorized: Invalid username or password',
      })
    }

    // Check if the user is verified
    if (!user.verified) {
      logger.info(`User ${username} is not verified`)
      return res.status(401).json({
        message: 'Unauthorized: User is not verified',
      })
    }

    logger.info(`User ${username} authorized`)
    logger.info(`Setting user ${username} in req`)
    req.user = user
    global.username = user.username
    next()
  }

  return authorizeToken
}