/**
 * http://usejsdoc.org/
 * Roberto Elizo
 */

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

var imgSchemaJSON = {
	title: {type:String, required:"El campo título es obligatorio"},
	creator: {type: Schema.Types.ObjectId, ref: "User" }, //El id de otro objeto y el schema al que referencia
	extension: {type: String, required:"La imagen debe tener una extensión"}
};

var img_schema = new Schema(imgSchemaJSON);

var Image = mongoose.model("Image", img_schema);

module.exports.Image = Image;
