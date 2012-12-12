require 'mechanize'

class UPSA

	def ready?
		begin
			@agent && @agent.get('https://upsa.epam.com/workload/index.do')
		rescue Mechanize::UnauthorizedError
			false
		end
	end

	def login(username, pwd)
		@agent ||= Mechanize.new
		@agent.verify_mode = OpenSSL::SSL::VERIFY_NONE

		login_page = @agent.get('https://upsa.epam.com/workload/login.do')
		login_form = login_page.form('loginForm')
		login_form.login = username
		login_form.password = pwd
		
		@agent.submit(login_form, login_form.buttons.first)

		begin
			@summary = @agent.get('https://upsa.epam.com/workload/resourcePoolSummaryMain.do')
		rescue Mechanize::UnauthorizedError
			@summary = nil
			false
		end
	end

	def find_person(what)
		search_form = @summary.form('searchForm')
		# FYI: UPSA onSearch() replaces starting and traling spaces
		search_form.query = what
		search_form.hiddenQuery = what

		results = @agent.submit(search_form, search_form.buttons.first)
		
		results.links.find{ |l| l.text == what and l.href =~ /employeeView.do?/ }
	end

	def fetch_profile(person)
		begin
			profile_page = @agent.get(person.href)
		rescue NoMethodError, Mechanize::ResponseCodeError
			return nil
		end

		location = profile_page.search('//tr/td[. = \'Location\']/following-sibling::td[last()]')
		# unit = profile_page.search('//tr/td[. = \'Unit\']/following-sibling::td/a')
		# manager = profile_page.search('//tr/td[. = \'Manager\']/following-sibling::td/a')

		{
		 :name => person.text,
		 :location => (location ? location.text().strip() : ''),
		 # :unit => (unit ? unit.text().strip() : ''),
		 # :manager => (manager ? manager.text().strip() : '')
		}	
	end

end
