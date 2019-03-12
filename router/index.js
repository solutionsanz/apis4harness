module.exports = function(app) {  
  // here we list our individual sets of routes to use
  require('./routes/ADWservices')(app);
  require('./routes/ATPservices')(app);
  require('./routes/NotificationService')(app);      
};