const Vineyard = require('../models/vineyard');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    const vineyards = await Vineyard.find({});
    res.render('vineyards/index', { vineyards })
}

module.exports.renderNewForm = (req, res) => {
    res.render('vineyards/new');
}

module.exports.createVineyard = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.vineyard.location,
        limit: 1
    }).send()
    const vineyard = new Vineyard(req.body.vineyard);
    vineyard.geometry = geoData.body.features[0].geometry;
    vineyard.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    vineyard.author = req.user._id;
    await vineyard.save();
    console.log(vineyard);
    req.flash('success', 'Successfully added a new location.');
    res.redirect(`vineyards/${vineyard._id}`)
}

module.exports.showVineyard = async (req, res) => {
    const vineyard = await Vineyard.findById(req.params.id).populate({
        path:'reviews',
    populate: {
        path: 'author'
    }
}).populate('author');
    if(!vineyard){
        req.flash('error', 'Sorry, we cannot find this location.');
        return res.redirect('/vineyards');
    }
    res.render('vineyards/show', { vineyard });
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const vineyard = await Vineyard.findById(id)
    if(!vineyard){
        req.flash('error', 'Sorry, we cannot find this location.');
        return res.redirect('/vineyards');
    }
    res.render('vineyards/edit', { vineyard });
}

module.exports.updateVineyard = async (req, res) => {
    const { id } = req.params;
    const vineyard = await Vineyard.findByIdAndUpdate(id, { ...req.body.vineyard });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    vineyard.images.push(...imgs);
    await vineyard.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await vineyard.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages} } } })
    }
    req.flash('success', 'Successfully updated vineyard.');
    return res.redirect(`/vineyards/${vineyard._id}`)
}

module.exports.deleteVineyard = async (req, res) => {
    const { id } =req.params;
    await Vineyard.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the location.');
    res.redirect('/vineyards');
}