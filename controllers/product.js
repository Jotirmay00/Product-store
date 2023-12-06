const Product = require('../models/product')

const getAllProducts = async(req,res)=>{

    try {
        const {featured,company,name,sort,fields,numericFilter} = req.query
        const queryObject = {}

        // filter for checking a boolean value
        if (featured) {
            queryObject.featured = featured === 'true' ? true : false
        }

        // filter for checking value among the selected values from enum
        if (company){
            queryObject.company = company
        }

        // filter for checking the pattern of the string 
        if (name){
            queryObject.name = {$regex : name , $options : 'i'}
        }

        //filter for numeric values 
        if(numericFilter){
            const operatorMap = {
                '>' : '$gt',
                '>=' : '$gte',
                '=' : '$eq',
                '<' : '$lt',
                '<=' : '$lte',
            };

            const regEx = /\b(<|>|>=|=|< |<=)\b/g;

            let filters = numericFilter.replace(regEx , (match)=> `-${operatorMap[match]}-`);

            const options = ['price','rating'];
            filters = filters.split(',').forEach((item) =>{
                const [field , operator,value] = item.split('-');
                if(options.includes(field)){
                    queryObject[field] = {[operator] : Number(value)}
                }
            })
        }

        let result =  Product.find(queryObject)

        // sorting the result 
        if (sort){
            const sortList = sort.split(',').join(' ')
            result = result.sort(sortList)
        }
        else{
            result = result.sort('createdDate')
        }

        //providing fields only asked for
        if(fields){
            const fieldList = fields.split(',').join(' ')
            result = result.select(fieldList)

        }


        const product = await result

        res.status(201).json({product})
    } catch (error) {
        res.status(500).json({msg:error})
    }
}


// For creating 1 product
const createProduct = async (req,res)=>{

    try {
        
        const product = await Product.create(req.body)
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}

// for getting only one product
const getProduct = async (req,res)=>{

    try {
        
        const {id : productID} = req.params
        const product = await Product.findOne({_id : productID})
        if(!product){
            return res.status(404).json({msg:`There is no product for the given id ${productID}`})
        }

        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({msg:error})
    }
    
}

//for updating a existing product
const updateProduct = async (req,res)=>{

    try {

        const {id : productID} = req.params
        const product = await Product.findOneAndReplace({_id  : productID},req.body,{
            new : true,
            runValidators : true,
        })
        if (!product) {
            return res.status(404).json({msg : `There is no product for the given ID ${productID}`})
        }
        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({msg : error})
    }
}


//for deleting a existing product
const deleteProduct = async (req,res) =>{

    try {
        const {id : productID} = req.params
        const product = await Product.deleteOne({_id : productID})
        if (!product) {
            return res.status(404).json({msg : `There is no such product with the given ID ${productID}`})
        }

        res.status(201).json(product)
    } catch (error) {
        res.status(500).json({msg:error})
    }
}


module.exports = {
    getAllProducts,
    getProduct,
    createProduct,
    deleteProduct,
    updateProduct,
}