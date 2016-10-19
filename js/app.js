$(document).ready(function() {

	$('#submit').on('click', function(e) {
		e.preventDefault();

		var ghusername = $('#username').val();
		var requri = 'https://api.github.com/users/'+ghusername;
		var repouri = 'https://api.github.com/users/'+ghusername+'/repos';

		requestJSON(requri, function(json) {
			function createRepoList(arrayObj, string) {
				if (arrayObj.length === 0) {
					string += "<h3>This user hasn't created any repositories yet! If it's you, make one and it'll show up here!</h3></div>";
				}

				else {
					string += "<p><strong>Repos List:</strong></p><br>";
					$.each(arrayObj, function(index) {
						string += "<a href='"+arrayObj[index].html_url+"' class='btn btn-default repo'>"+arrayObj[index].name+"</a>";
					});
					string += "</div>";
				}
				return string;
			}

			// if user doesn't exist
			if(json.message === "Not Found" || ghusername === '') {
				$('#githubApiData').html('<h2>No user was found with that username, sorry :( </h2>');
			}

			else {
				// we should have a user. display the info.

				var fullname = json.name;
				var username = json.login;
				var aviurl = json.avatar_url;
				var profileurl = json.html_url;
				var location = json.location;
				var followersnum = json.followers;
				var followingnum = json.following;
				var reposnum = json.public_repos;

				if (fullname === undefined) {
					fullname = username;
				}

				var output = '<h2>'+fullname+'</h2>';
				output += "<span>(@<a href='"+profileurl+"'>"+username+"</a>)</span> <div class='clearfix'></div>";
				output += "<div class='content'><img src='"+aviurl+"' alt='"+fullname+"' width='120' height='120' />";
				output += "<p>Followers: "+followersnum+" - Following: "+followingnum+"<br> Repos: "+reposnum+"</p></div>";
				output += "<div class='repolist'>";

				$.getJSON(repouri).done(function(result){
					var repos = result;
					var finalOutput = createRepoList(repos, output);
					$('#githubApiData').html(finalOutput);
				}).fail(function(error) {
					console.log(error);
				});
			}
		});

});

function requestJSON(url, callback) {
	$.ajax({
		url: url,
		complete: function(xhr) {
			callback.call(null, xhr.responseJSON);
		}
	});
}

});

