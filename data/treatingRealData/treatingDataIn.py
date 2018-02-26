
import csv
import json

# REMOVING ALL ROWS THAT HAVE THE SAME COUNTRY IN THE "from/to" COLUMN ----------------------
with open('data.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('1_removingSameCountryInOut.csv', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)


		# Write the First Row: year, Country of Residence, Country of Origin,...
		firstRow = ["Year", "Country of Residence", "Country of Origin", "Population type", "Value"]
		writer.writerow(firstRow)

		#skip the first line
		frstL = next(reader)


	  # REMOVING ALL ROWS THAT HAVE THE SAME COUNTRY IN THE "from/to" COLUMN ----------------------
		# Go through each row of the csv file
		for row in reader:
			# Let's print only if the country FROM is different from country TO.
			if row[1] != row[2]:

				''' row[0] = Year
						row[1] = Country territory of asylum residence
						row[2] = Origin
						row[3] = Population type
						row[4] = Value'''

				writer.writerow( [ row[0], row[1], row[2], row[3], row[4] ])
		# -------------------------------------------------------------------------------------------




'''
# REMOVING	"Internally displaced persons (IDPs)"	
						"Returned refugees"		"Returned IDPs"		
						"Stateless persons"	"Others of concern" -------------------------------------------'''
with open('1_removingSameCountryInOut.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('2_removingCateogories.csv', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)
	
		
		for row in reader:
			''' row[0] = Year
							row[1] = Country territory of asylum residence
							row[2] = Origin
							row[3] = Population type
							row[4] = Value'''
		
			toRemove = []
			toRemove.append("Internally displaced persons (IDPs)")
			toRemove.append("Internally displaced persons")
			toRemove.append("Returned refugees")
			toRemove.append("Returned IDPs")
			toRemove.append("Stateless persons")
			toRemove.append("Others of concern")

			if(row[3] not in toRemove):
				writer.writerow( [ row[0], row[1], row[2], row[3], row[4] ] )							
# ---------------------------------------------------------------------------------------------
			


# SUMMING THE REFUGEES + ASYLUMN SEEKERS ------------------------------------------------------
with open('2_removingCateogories.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('3_addingAsylumnSeekers_refugees.csv', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)
	


		data = list(reader)


		# Write the First Row: year, Country of Residence, Country of Origin,...
		firstRow = ["Year", "Country of Residence", "Country of Origin", "Value"]
		writer.writerow(firstRow)



		index = 1
		for r in data[1:len(data)-1]:
			''' 	  row[0] = Year
							row[1] = Country territory of asylum residence
							row[2] = Origin
							row[3] = Population type
							row[4] = Value'''

			
			if( r[4] == "*"):
				r[4] = 0	


			if(index+1 <= len(data) -1):

				# If the next row has the same Year, Country of Residence, and Country of Origin
				if( data[index][0] == data[index+1][0] and data[index][1] == data[index+1][1] and data[index][2] == data[index+1][2]):


					if( data[index][4] == "*"):
						data[index][4] = 0

					if( data[index+1][4] == "*"):
						data[index+1][4] = 0


					adding = int( data[index][4] ) + int( data[index+1][4] ) 
					writer.writerow( [ data[index][0], data[index][1], data[index][2], adding] )	

					index += 2
				else:
					writer.writerow( [ data[index][0], data[index][1], data[index][2], data[index][4] ] )	
					index += 1
# ---------------------------------------------------------------------------------------------


# CREATE A LIST OF ALL COUNTRIES ------------------------------------------------------------------
countries = []
years	  = []

with open('3_addingAsylumnSeekers_refugees.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('Countries.txt', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)

		#skip the first line
		frstL = next(reader)


		# Go through each row of the csv file
		for row in reader:
			''' 	  row[0] = Year
							row[1] = Country territory of asylum residence
							row[2] = Origin
							row[3] = Population type
							row[4] = Value'''

			if (row[1] not in countries ):
				countries.append( row[1] )		

			if ( row[0] not in years ):
				years.append( row[0] )


# ---------------------------------------------------------------------------------------------
			




# CREATING THE DATA FOR BARCHART IN
# ---------------------------------------------------------------------------------------------
with open('3_addingAsylumnSeekers_refugees.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('barChartDataIn.txt', 'w') as td:
		# Where we are going to write
		writer = csv.writer(td)

		# Transforming the data to a list
		data = list(reader)	

		# Write the First Row: year, Country of Residence, Country of Origin,...
		firstRow = ["Year", "Country of Residence", "Value"]
		writer.writerow(firstRow)



		#				 Country Name 
		currentCountry = data[1][1]
		#				 Value of refugees
		totalValue 	   = int(data[1][3])
		#				 Year
		currentYear    = data[1][0]



		print str(currentCountry) + "	" + str(data[1][3])
	


		# We need to know what's the last country and the last year
		#  so that we don't miss it on the for loop below
		lastCountry = data[len(data)-1][1]
		lastYear    = data[len(data)-1][0]

		#
		for r in data[2:]:
			# If we are dealing with a new country
			if( currentCountry != r[1] ):
				writer.writerow( [ currentYear, currentCountry, totalValue ] )	
				
				# update the country/year/totalValue
				currentCountry  = r[1]
				currentYear		= r[0]
				totalValue 		= int(r[3])
		
			# If we are dealing with the same country
			else:
				totalValue += int(r[3])

		writer.writerow( [ currentYear, currentCountry, totalValue ] )	
				
		
# ---------------------------------------------------------------------------------------------









# CREATING THE JSON ---------------------------------------------------------------------------
'''
data = {}  
data['people'] = []  
data['people'].append({  
    'name': 'Scott',
    'website': 'stackabuse.com',
    'from': 'Nebraska'
})
data['people'].append({  
    'name': 'Larry',
    'website': 'google.com',
    'from': 'Michigan'
})
data['people'].append({  
    'name': 'Tim',
    'website': 'apple.com',
    'from': 'Alabama'
})

with open('TESTE.json', 'w') as outfile:  
    json.dump(data, outfile)
'''





'''
with open('3_addingAsylumnSeekers_refugees.csv', 'r') as csv_file:
	reader = csv.reader(csv_file)

	with open('JSON.txt', 'w') as td:
		# Where we are going to write
		#writer = csv.writer(td)


		# Transforming to a list
		data = list(reader)	

		
'''
'''						row[0] = Year
						row[1] = Country territory of asylum residence
						row[2] = Origin
						row[3] = Population type
						row[4] = Value'''

'''
		#currentCountry = data[1][1] # Country territory of asylum residence
		#currentYear    = data[1][0] # Year

		data_json = {}  
		data_json['In'] = [] 	
		
		# For each country
		for country in countries[:2]:
			#print country

			yearsList = []

			# We can pick the starting and ending date here
			for year in years[49:]:
				print country + "	" + year
				origins = []
				
				total = 0
				# Lets loop through all the data
				for r in data[1:]: # Skipping the first row			
					if(r[1] == country and r[0] == year):
						origDict = {}
						origDict["Country"] = r[2]
						origDict["Value"]   = r[3] 
						
						total += int( r[3] )

						origins.append(origDict);

						yDict = {}
						yDict["Year"]    = year
						yDict["Value"]   = total
						yDict["Origins"] = origins

						yearsList.append(yDict)

			countryInDict = {}
			countryInDict["Country"] = country
			countryInDict["Years"]	 = yearsList
				
			data_json['In'].append(countryInDict)
					
		#print data_json
		json.dump(data_json, td)

		
		index = 2
		"""
		for r in data[2:len(data)-1]: # Skipping the first and second row

			# If the current row is for a new country, we should update which country we are dealing with.
			if( r[1] != currentCountry):
				currentCountry = r[1] 

			# Updating the new year if necessary
			if( r[0] != currentYear ):
				currentYear =  r[0]

			
	
			data_json['In'].append({  
					'Country': currentCountry,
					'Years': 'stackabuse.com',
					'from': 'Nebraska'
			})
			"""



# ---------------------------------------------------------------------------------------------
'''


		

#index = 0
#for y in years:
#	print y + "	" + str(index)
#	index += 1





















