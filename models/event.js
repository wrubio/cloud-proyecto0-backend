var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventlSchema = new Schema({
    name: { type: String, required: [true, 'El evento require un nombre'] },
    description: { type: String, required: [true, 'Se requiere una descripcio del evento'] },
    created: { type: Date, default: Date.now },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
}, { collection: 'events' });

module.exports = mongoose.model('Event', eventlSchema);