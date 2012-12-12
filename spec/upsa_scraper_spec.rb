require './upsa_scraper'

describe UPSA do 
	before :each do
		@upsa = UPSA.new
	end

	it 'starts uninitialized' do
		expect(@upsa.ready?).to be_false
	end

	it 'can log me in using my credentials' do
		success = @upsa.login(ENV['UPSA_LOGIN'], ENV['UPSA_PASSWORD'])

		expect(success).to be_true
	end

	it 'should return false if can\'t login' do
		success = @upsa.login('nosuchuser', 'wrongpassword')

		expect(success).to be_false
	end

	context 'logged in' do
		before :each do
			@upsa.login(ENV['UPSA_LOGIN'], ENV['UPSA_PASSWORD'])
		end

		it 'should search for a given name and return results' do
			result = @upsa.find_person('Pavel Veller')

			result.should_not be_nil
			result.text.should eq('Pavel Veller')
		end

		it 'should return nil if not found or if too many results' do
			result = @upsa.find_person('ThisPersonDoesNotExist')
			result.should be_nil

			result = @upsa.find_person('Pavel')
			result.should be_nil
		end

		context 'found a person' do
			before :each do
				@person = @upsa.find_person('Pavel Veller')
			end

			it 'should be possible to fetch user profile' do
				profile = @upsa.fetch_profile(@person)

				profile.should_not be_nil
				profile[:name].should eq(@person.text)
				profile[:location].should eq('NA, USA, Atlanta, Off-site')
				# profile[:unit].should eq('EPAM/NA Operations/Delivery')
				# profile[:manager].should eq('Viktar Dvorkin')
			end

			it 'should return nil if cant fetch the profile' do
				profile = @upsa.fetch_profile(nil)
				profile.should be_nil

				profile = @upsa.fetch_profile(Object.new)
				profile.should be_nil

				profile = @upsa.fetch_profile(Struct.new(:text, :href).new('NA', 'NA'))
				profile.should be_nil
			end

		end
	end


end