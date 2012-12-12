# coffee -o build --bare -c jquery.mongohq.coffee

(($) ->

  Connection = (options)->
    this.options = options || {}
    this.apikey = this.options['apikey']
    throw("apikey must be set") if(this.apikey == null)
    this.url = this.options['url'] || 'https://api.mongohq.com'

  Connection.prototype.call = (path, method, options)->
    options ||= {}
    data = options['data'] || options['params'] || options['query'] || {}
    success = options['success'] || (data)->data
    error = options['error']

    data['_apikey'] = this.apikey

    try
      $.ajax
        url: this.url + path
        async: false
        dataType: 'json' #(if method == 'GET' then 'jsonp' else 'json')
        data: (if method == 'GET' then data else JSON.stringify(data))
        headers:
          "User-Agent" : "MongoHQ/0.1/js-client"
          "Content-Type" : "application/json"
          "MongoHQ-API-Token" : this.apikey
        type: method
        success: (data, textStatus, jqXHR)->
          success(data)
        error: (jqXHR, textStatus, errorThrown)-> 
          if error
            error(errorThrown)
          else
            throw textStatus
    catch error
      console.log 'derp'

    success

  # TODO: implement x-domain POSTs
  # Connection.prototype.post = (path, method, options)->

  connection = ()-> new Connection(window._mhq_options)

  # Database actions
  Database = ->
  Database.prototype.all = (options)->
    options = options || {}
    connection().call "/databases", 'GET', options
  Database.prototype.find = (options)->
    options = options || {}
    db_name = options['db_name']
    connection().call "/databases/#{db_name}", 'GET', options
  # $.mongohq.databases.create({data: {'name' : 'my_new_db'}})
  Database.prototype.create = (options)->
    options = options || {}
    connection().call "/databases", 'POST', options
  Database.prototype.delete = (options)->
    options = options || {}
    db_name = options['db_name']
    connection().call "/databases/#{db_name}", 'DELETE', options

  # Plan actions
  Plan = ->
  Plan.prototype.all = (options)->
    options = options || {}
    connection().call "/plans", 'GET', options

  # Installs actions
  Deployment = ->
  Deployment.prototype.all = (options)->
    options = options || {}
    connection().call "/deployments", 'GET', options
  Deployment.prototype.find = (options)->
    options = options || {}
    db_name = options['name']
    connection().call "/deployments/#{name}", 'GET', options
  Deployment.prototype.stats = (options)->
    options = options || {}
    db_name = options['name']
    connection().call "/deployments/#{name}/stats", 'GET', options
  Deployment.prototype.stats = (options)->
    options = options || {}
    db_name = options['name']
    connection().call "/deployments/#{name}/logs", 'GET', options

  # Collection actions
  Collection = ->
  Collection.prototype.all = (options)->
    options = options || {}
    throw "db_name is required" unless db_name = options['db_name']
    connection().call "/databases/#{db_name}/collections", 'GET', options
  Collection.prototype.find = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}", 'GET', options
  # $.mongohq.collections.create({db_name: 'my_db', data: {'name' : 'my_new_col'}})
  Collection.prototype.create = (options)->
    options = options || {}
    db_name = options['db_name']
    connection().call "/databases/#{db_name}/collections", 'POST', options
  # $.mongohq.collections.update({db_name: 'my_db', col_name: 'my_col', params: {...}})
  Collection.prototype.update = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}", 'PUT', options
  Collection.prototype.delete = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}", 'DELETE', options

  # Document actions
  Document = ->
  Document.prototype.all = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}/documents", 'GET', options
  Document.prototype.find = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    doc_id = options['doc_id']
    connection().call "/databases/#{db_name}/collections/#{col_name}/documents/#{doc_id}", 'GET', options
  # $.mongohq.documents.create({db_name: 'my_db', col_name: 'my_col', data: {'name' : 'my_new_col'}})
  Document.prototype.create = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}/documents", 'POST', options
  # $.mongohq.documents.update({db_name: 'my_db', col_name: 'my_col', doc_id: 'my_doc', params: {'$set': {field : 2} }})
  Document.prototype.update = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    doc_id = options['doc_id']
    connection().call "/databases/#{db_name}/collections/#{col_name}/documents/#{doc_id}", 'PUT', options
  Document.prototype.delete = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    doc_id = options['doc_id']
    connection().call "/databases/#{db_name}/collections/#{col_name}/documents/#{doc_id}", 'DELETE', options


  # Index actions
  Index = ->
  Index.prototype.all = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}/indexes", 'GET', options
  Index.prototype.find = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    ind_name = options['ind_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}/indexes/#{ind_name}", 'GET', options
  # $.mongohq.indexes.create({db_name: 'my_db', col_name: 'my_col', data: {'name' : 'my_new_col'}})
  Index.prototype.create = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}/indexes", 'POST', options
  # $.mongohq.indexes.delete({db_name: 'my_db', col_name: 'my_col', ind_name: 'my_ind'})
  Index.prototype.delete = (options)->
    options = options || {}
    db_name = options['db_name']
    col_name = options['col_name']
    doc_id = options['doc_id']
    ind_name = options['ind_name']
    connection().call "/databases/#{db_name}/collections/#{col_name}/indexes/#{ind_name}", 'DELETE', options

  # Invoice actions
  Invoice = ->
  Invoice.prototype.all = (options)->
    options = options || {}
    connection().call "/invoices", 'GET', options
  Invoice.prototype.find = (options)->
    options = options || {}
    name = options['name']
    connection().call "/invoices/#{name}", 'GET', options

  # Slow Queries actions
  SlowQuery = ->
  SlowQuery.prototype.all = (options)->
    options = options || {}
    db_name = options['db_name']
    connection().call "/slow_queries/#{db_name}", 'GET', options
  SlowQuery.prototype.find = (options)->
    options = options || {}
    db_name = options['db_name']
    doc_id = options['doc_id']
    connection().call "/slow_queries/#{db_name}/#{doc_id}", 'GET', options


  $.mongohq =
    authenticate : (options)->
      window._mhq_options = options || {}
      this
    plans : new Plan()
    deployments : new Deployment()
    databases : new Database()
    collections : new Collection()
    documents : new Document()
    indexes : new Index()
    invoices : new Invoice()
    slow_queries : new SlowQuery()

)(jQuery)
