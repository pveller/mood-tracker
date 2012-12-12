require 'sinatra'
require 'json'
require './upsa_scraper'
require 'mongo'
require 'uri'

set :logging, true
set :public_folder, 'public'

get '/' do
	redirect '/index.html'
end

get '/upsa/:name' do
	@@cache ||= {}

	profile = @@cache[params[:name]]

	if (!profile)
		@@upsa ||= UPSA.new
		@@upsa.login('Pavel_Veller', 'Epam20124!') unless @@upsa.ready?
		
		person = @@upsa.find_person(params[:name])
		profile = @@upsa.fetch_profile(person)
	end		

	# response.headers['Access-Control-Allow-Origin'] = '*'
	# response.headers['Access-Control-Allow-Credentials'] = 'true'

	if (profile)
		@@cache[params[:name]] = profile

		body profile.to_json
	else
		body '{}'
	end	
end
