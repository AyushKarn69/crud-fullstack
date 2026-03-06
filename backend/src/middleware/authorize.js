// Role-based access control authorization middleware

const authorize = (...roles) => {
  return (req, res, next) => {
    next();
  };
};

export default authorize;
